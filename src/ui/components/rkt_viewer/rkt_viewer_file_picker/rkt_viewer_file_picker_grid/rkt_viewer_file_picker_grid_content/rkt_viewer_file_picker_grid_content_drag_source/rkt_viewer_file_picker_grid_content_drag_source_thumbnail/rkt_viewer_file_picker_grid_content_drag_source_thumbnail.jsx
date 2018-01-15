import React, { Component } from 'react';
//import PubSub from 'pubsub-js'

//actions
import { getViewerType, loadImage, getImageName, getDicomMetadata } from './rkt_viewer_file_picker_grid_content_drag_source_thumbnail_actions';

//Using global variables
const cornerstone = window.cornerstone;

export default class RktViewerFilePickerGridContentDragSourceThumbnail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            imageId: null,
            viewerType:undefined,
            loaded: false,
            error: false,
            elementWidth: this.props.canvasWidth,
        };

        this.onImageLoaded = this.onImageLoaded.bind(this);
        this.onErrorLoading = this.onErrorLoading.bind(this);
        this.handleThumbnailClicked = this.handleThumbnailClicked.bind(this);
    }

    componentDidMount() {

        this.setState({
            elementWidth: this.containerThumbnail.clientWidth,// - 20,
            loaded: false,
            error: false
        });

        var files = this.props.files;
        var url = this.props.url;
        
        var myComponent = this;

        getViewerType(files, url, function(viewerType) {
            
            myComponent.setState({
                viewerType: viewerType
            })

            if (viewerType!==undefined) { // the image is only displayed if its format is compatible
                loadImage(viewerType, files, url, myComponent.onImageLoaded, myComponent.onErrorLoading);
            } else {
                myComponent.onErrorLoading(false);
            }
            
        });

    }

    onErrorLoading(err) {
        this.setState({
            error: true
        });
        this.props.onLoaded(null);
    }

    onImageLoaded(cornerstoneImage) {
        var element = this.imageThumbnail;
        cornerstone.enable(element);
        var viewport = cornerstone.getDefaultViewportForImage(element, cornerstoneImage);

        // image is displayed
        cornerstone.displayImage(element, cornerstoneImage, viewport);

        this.setState({
            loaded: true,
            image: cornerstoneImage,
            error: false
        })

        var pngCanvas = this.getImageCanvas();
        var metadata;
        if (this.state.viewerType === "dicom") {
            metadata = getDicomMetadata(cornerstoneImage);
        } else {
            metadata = undefined;
        }
        
        // metadata of the dicom is passed to "Stats" component
        this.props.onLoaded(cornerstoneImage.data, pngCanvas, metadata);
    }

    handleThumbnailClicked() {
        var index = this.props.index;
        var files = this.props.files;
        var url = this.props.url;
        var viewerType = this.state.viewerType;

        this.props.onClick(index, files, url, viewerType);
    }

    getImageCanvas(){
        
        if (this.state.image) {
            if (this.state.image.getCanvas) {
                return this.state.image.getCanvas();
            }
            else {
                //alert("(getImageCanvas) Error loading this image");
                return undefined;
            }
        }else {
            return undefined;
        }
 
    }

    getImageDataURL(){
        
        if (this.state.image) {
            if (this.state.image.getCanvas) {
                var image = new Image();
                image.src = this.state.image.getCanvas().toDataURL("image/png");
                return image;
            }
            else {
                //alert("(getImageDataURL) Error loading this image");
                alert("Error loading this image");
                return undefined;
            }
        } else {
            return undefined;
        }

    }

    render() {

        return (
            <div>
                <a style={{ position: "relative" }}
                    className="grid-block vertical container-thumbnail"
                    unselectable='on'
                    onClick={this.handleThumbnailClicked}
                    ref={(containerThumbnail) => this.containerThumbnail = containerThumbnail}>

                    <div className={this.props.isSelected ? "grid-block image-thumbnail selected" : "grid-block image-thumbnail"}
                        ref={(imageThumbnail) => this.imageThumbnail = imageThumbnail}
                        style={{ top: "0px", left: "0px", width: this.state.elementWidth, height: this.state.elementWidth * 0.75, background: "black" }}>
                        {this.state.error && <span className="error-not-image">Not a valid image</span>}
                        {(this.state.loaded === false && this.state.error === false) && <span className="loading-icon rotating">Loading</span>}
                    </div>

                    <div className="grid-block image-filename">
                        {this.state.error && <i className="fi-alert"></i>}
                        {getImageName(this.props.files, this.props.url)}
                    </div>
                </a>
            </div>
        );
    }
}

RktViewerFilePickerGridContentDragSourceThumbnail.defaultProps = {
    imgUrl: "",
    canvasWidth: 200,
};
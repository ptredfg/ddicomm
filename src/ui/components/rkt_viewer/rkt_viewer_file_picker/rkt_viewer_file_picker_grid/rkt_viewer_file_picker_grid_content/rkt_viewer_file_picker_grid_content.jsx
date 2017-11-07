import React, { Component } from 'react';
import RktViewerFilePickerGridContentThumbnail from './rkt_viewer_file_picker_grid_content_thumbnail/rkt_viewer_file_picker_grid_content_thumbnail';

// actions
import { array2Object } from './rkt_viewer_file_picker_grid_content_actions.js';

export default class RktViewerFilePickerGridContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedImg: -1,
            imgInstances: [],
        }
    }

    componentWillUpdate(nextProps) {
        if (nextProps.fileList !== this.props.fileList) {
            this.clearGrid();
        }
    }

    clearGrid() {
        this.setState({
            selectedImg: -1,
            fileInstances: [],
        });
    }

    renderGrid() {
        var fileList = this.props.fileList; // {0: File, 1: File, ... , lenght: int}

        // in case "fileList" is an array of objects like [File, File, ..., File]
        // fileList.map((fileObject, key) => {
        //     //var files = fileList[key];
        //     //console.log(file);
        //     var files = array2Object([fileObject]);
        //     console.log(files);
        //     console.log(key);
        //     return (
        //         <RktViewerFilePickerGridContentThumbnail
        //             index={key}
        //             files={files}
        //             url={url}
        //             isSelected={key === this.state.selectedImg}
        //             onLoaded={this.handleImgLoaded.bind(this)}
        //             onClick={this.handleImgClicked.bind(this)}
        //         />
        //     )
        // })

        var keys_fileList = Object.keys(fileList); // ["0", "1", ... , "n", "length"]
        keys_fileList.pop(); // ["0", "1", ... , "n"]

        var url; // !!!!!!!!!!!!!!

        return (
            keys_fileList.map((key) => {

                var value = fileList[key];
                var files = array2Object([value]); // same as doing "var files = {0:fileList[key], "lenght":1};"

                return (
                    <RktViewerFilePickerGridContentThumbnail
                        index={key}
                        files={files}
                        url={url}
                        isSelected={key === this.state.selectedImg}
                        onLoaded={this.handleImgLoaded.bind(this)}
                        onClick={this.handleImgClicked.bind(this)}
                    />
                )
            })
        );
    }

    handleImgLoaded(data) {
        let instances = this.state.imgInstances;
        instances.push(data);

        this.setState({
            dicomInstances: instances
        })

        this.props.onchangegridcontent(this.state.imgInstances);
    }

    handleImgClicked(index, file, url, viewerType) {
        this.setState({
            selectedImg: index
        })

        // data of the selected image is passed to the "Sidebar" component
        this.props.handleimgselected(file, url, viewerType);

    }

    render() {
        return (
            <div className="grid-block file-picker-grid-content">
                <div className="grid-block small-up-3 align-spaced">
                    {this.renderGrid()}
                </div>
            </div>

        );
    }
}
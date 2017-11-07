import React, { Component } from 'react';

// actions
import { initScene, loadVTK } from "./rkt_viewer_vtk_actions.js";
// modules
import { isObjectEmpty } from './../../../../modules/rkt_module_object';
import { obtainBlobUrl } from "./rkt_viewer_vtk_modules.js";
// components
import RktToolboxList from "./../../rkt_toolbox/rkt_toolbox_list/rkt_toolbox_list";
import RktToolboxTableInputs from "./../../rkt_toolbox/rkt_toolbox_table_inputs/rkt_toolbox_table_inputs";
import RktAnimationLoading from './../../rkt_animation/rkt_animation_loading/rkt_animation_loading';
// utils
import newId from "./../../../../utils/newid.js";

export default class RktViewerVTK extends Component {

    constructor() {
        super()
        this.state = {
            loaded: false,
            info_toolbox_list: false,
            info_toolbox_table_inputs: false,
            open_toolbox_table_inputs: false
        }
    }

    initstate() {

        this.setState({
            loaded: false,
            info_toolbox_list: false,
            info_toolbox_table_inputs: false
        });
    }

    componentDidMount() {

        var url = this.props.url;
        var blob = this.props.files;

        var myComponent = this;

        initScene(function (scene) {

            if (!isObjectEmpty(scene)) {

                myComponent.setState({
                    scene: scene
                });

                myComponent.loadVTK(scene, url, blob);

            } else {
                alert("Problems creating the Scene");
            }
        });
    }

    componentWillReceiveProps(nextProps) {

        this.initstate(); // this.state.loaded is set to "false"

        var url = nextProps.url;
        var blob = nextProps.files;
        var scene = this.state.scene;

        if (!isObjectEmpty(scene)) {
            this.loadVTK(scene, url, blob);
        } else {
            alert("Problems with the scene");
        }

    }

    loadVTK(scene, url, blob) {

        var url_to_load;
        var myComponent = this;

        if (!isObjectEmpty(url)) {

            url_to_load = url;

        } else if (!isObjectEmpty(blob)) {

            var blob_url = obtainBlobUrl(blob);
            url_to_load = blob_url;

        }

        loadVTK(scene, url_to_load,
            // in case of VTK labels obtention
            function (info_toolbox_list, info_toolbox_table_inputs) {

                if ((info_toolbox_list) || (info_toolbox_table_inputs)) {

                    myComponent.setState({
                        info_toolbox_list: info_toolbox_list,
                        info_toolbox_table_inputs: info_toolbox_table_inputs
                    });
                }

            },
            // when geometry has been loaded
            function (geometryLoaded) {

                if (geometryLoaded) {
                    myComponent.setState({
                        loaded: true
                    })

                    // var canvasScene = document.getElementById("container-viewer").childNodes[0];
                    // console.log(canvasScene);
                    // var sceneURL = canvasScene.toDataURL("image/jpeg");
                    // // jpeg if you do not want to display transparent background
                    // // jpeg does not support transparency
                    // //console.log(sceneURL);

                    // var pngCanvas = document.getElementById("pngCanvas");
                    // var context = pngCanvas.getContext("2d");
                    // var image = new Image();
                    // image.src = sceneURL;
                    // image.onload = function () {
                    //     context.drawImage(image, 0, 0, canvasScene.width, canvasScene.height);
                    // }

                    // document.getElementById("container-viewer").remove();
                    // document.getElementById("container-axes").remove();
                }
            }
        );
    }

    createToolboxList(info_toolbox_list, info_toolbox_table_inputs) {

        if (info_toolbox_list) {
            return (
                info_toolbox_list.map((toolbox_list) => {
                    if (toolbox_list.title === "VTK LABELS") {
                        // the toolbox list will have an extra toolbox
                        return (
                            <RktToolboxList key={newId()}
                                title={toolbox_list.title}
                                items={toolbox_list.items}
                                addextratoolboxfunction={this.createToolboxTableInputs}
                                extratoolboxinfo={info_toolbox_table_inputs}
                                onclickitem={toolbox_list.onclickitem} />
                        )
                    } else {
                        // this will be a default toolbox list
                        return (
                            <RktToolboxList key={newId()}
                                title={toolbox_list.title}
                                items={toolbox_list.items}
                                onclickitem={toolbox_list.onclickitem} />
                        )
                    }

                })
            );
        }
    }

    createToolboxTableInputs(info_toolbox_table_inputs) {

        if (info_toolbox_table_inputs) {

            return (
                info_toolbox_table_inputs.map((toolbox_table_inputs) => {
                    return (
                        <RktToolboxTableInputs key={newId()}
                            title={toolbox_table_inputs.title}
                            items={toolbox_table_inputs.items}
                            onsubmitinputs={toolbox_table_inputs.onSubmit} />
                    )
                })
            );

        }
    }

    renderVTKLoading() {
        if (!this.state.loaded) {
            return (<RktAnimationLoading />);
        }
    }

    render() {
        var info_toolbox_list = this.state.info_toolbox_list;
        var info_toolbox_table_inputs = this.state.info_toolbox_table_inputs;

        return (
            <div className="vertical grid-block rkt-viewer-vtk" >
                {this.renderVTKLoading()}
                <div className="grid-block container-toolboxes" id="container-toolboxes" >
                    {this.createToolboxList(info_toolbox_list, info_toolbox_table_inputs)}
                </div>
                <div className="container-axes" id="container-axes" ></div>
                <div className="container-viewer" id="container-viewer" ></div>
                {/* <canvas id="pngCanvas" width="1300px" height="620px"
                    style={{
                        color: "white", border: "1px solid #d3d3d3",
                        width: "1300px", height: "620px"
                    }}>
                </canvas> */}
            </div>
        );
    }
}
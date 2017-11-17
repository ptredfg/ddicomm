import React, { Component } from 'react';

export default class RktToolboxStageStats extends Component {

    constructor() {
        super();
        this.state = {

        };
    }

    renderLoadingProgressBar() {
        return (
            <div className="grid-block vertical shrink progress-bar-section" style={{ overflow: "hidden" }} >
                <progress className="loading-progress-bar"
                    value={this.props.loadedDicoms}
                    max={this.props.totalDicoms}>
                </progress>
            </div>
        )
    }

    renderFolderInfo() {
        return (
            <div className="grid-block shrink folder-info" style={{ overflow: "hidden" }} >
                <h4>
                    <i className="fi-folder"></i>
                    <span>{" "}</span>
                    {this.props.title} {(this.props.totalDicoms > 0) && "(" + this.props.loadedDicoms + "/" + this.props.totalDicoms + ")"}
                </h4>
            </div>
        );
    }

    renderStats() {
        return (
            <div className="grid-block align-left stats">
                {Object.keys(this.props.items).map((key) => {
                    var name_stat_item = key;
                    var number_stat_item = this.props.items[name_stat_item]
                    return (
                        <div className="stat-item" index={key}>
                            <span className="name-stat-item">
                                {name_stat_item}
                            </span>
                            <span className="number-stat-item">
                                {number_stat_item}
                            </span>
                        </div>
                    )
                })}
            </div>
        )
    }

    render() {
        return (
            <div className="grid-block vertical shrink container-stats">
                {this.renderLoadingProgressBar()}
                {this.renderFolderInfo()}
                {this.renderStats()}
            </div>
        );
    }
}
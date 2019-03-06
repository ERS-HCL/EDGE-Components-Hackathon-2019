import React, { Component } from 'react';
import styled from "styled-components";
import PropTypes from "prop-types";
import Tooltip from '@material-ui/core/Tooltip';
/* import "./Star.css"; */

const StarStyleWrapper = styled.div`    
    transform:rotateY(180deg);
    text-align:right;   

    .stars{
        color: ${props => props.stylesObj.selectedColor};
        font-size:${props => props.stylesObj.fontSize}px;
        position:relative;
        display:inline-block;
        text-shadow:${props => "2px 2px 4px " +  props.stylesObj.selectedColor};
        margin:5px;       
    } 

    .stars:hover, .stars:hover ~ .stars{
        cursor:pointer;
        &:before{
            content:"\\2605";            
            position:absolute;
            left:0%;
            top:0%;
        }
    } 

   .fullStar{             
        &:before {
            content:"\\2605"; 
            position:absolute;
            left:0%;
            top:0%;  
        }      
    }    
    
`

class Star extends Component{
    state = {
        maxRating:parseInt(this.props.maxRating),
        currentRating:parseInt(this.props.currentRating)
    }

    markRate = (id) => {
        this.setState({currentRating:parseInt(id)},() => {
            console.log("Current ",this.state.currentRating);
            this.props.updateRating(this.state.currentRating);
        });
    }

    addRate = (id) => {
        let classes = ["stars"];
        if(id <= this.state.currentRating){
            classes.push("fullStar");
        }
        return classes;
    }

    createStars = () => {
        let arr = [];
        for(let i=this.state.maxRating; i>=1; i--){
            let addRate = this.addRate(i);
            arr.push(<Tooltip title={i} placement="top" key={i-1}>
                 <div className={[...addRate].join(" ")}
                id={i} 
                onClick={(event) => this.markRate(event.currentTarget.id)}>&#9734;</div>
            </Tooltip>
           )
        }
        return arr;
    }

    render(){       
        let stylesObj = {
            fontSize:this.props.fontSize,
            selectedColor:this.props.selectedColor
        }

        return(<StarStyleWrapper stylesObj={stylesObj}>               
                {this.createStars()}          
           </StarStyleWrapper>)
    }
}

export default Star;

Star.propTypes = {
    fontSize:PropTypes.number,
    selectedColor:PropTypes.string,
    maxRating:PropTypes.number,
    currentRating:PropTypes.number,
    updateRating:PropTypes.func.isRequired
}

Star.defaultProps = {
    fontSize:100,
    selectedColor:"yellow",
    maxRating:5,
    currentRating:0
}

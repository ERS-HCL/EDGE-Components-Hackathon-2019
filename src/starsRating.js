import React, { Component } from 'react'
import PropTypes from 'prop-types'

const parentStyles = {
  overflow: 'hidden',
  position: 'relative'
}

const starsDefaultStyles = {
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
  display: 'block',
  float: 'left'
}

const getHalfStarStyles = (color, uniqueness) => {
  return `
    .react-stars-${uniqueness}:before {
      position: absolute;
      overflow: hidden;
      display: block;
      z-index: 1;
      top: 0; left: 0;
      width: 50%;
      content: attr(data-forhalf);
      color: ${color};
  }`
}

class StarRatingComponent extends Component {

  constructor(props) {

    super(props)

    // set defaults

    props = Object.assign({}, props)

    this.state = {
      uniqueness: (Math.random() + '').replace('.', ''),
      value: props.value || 0,
      stars: [],
      halfStar: {
        at: Math.floor(props.value),
        hidden: props.half && props.value % 1 < 0.5
      }
    }

    this.state.config = {
      count: props.count,
      starSize: props.size,
      char: props.char,
      // Default inactive star color
      initStarColor: props.initStarColor,
      // Active star color
      selectedStarFillColor: props.selectedStarFillColor,
      half: props.half,
      edit: props.edit,
    }

  }

  componentDidMount() {
    this.setState({
      stars: this.getStars(this.state.value)
    })
  }

  componentWillReceiveProps(props) {
    this.setState({
      stars: this.getStars(props.value),
      value: props.value,
      halfStar: {
        at: Math.floor(props.value),
        hidden: this.state.config.half && props.value % 1 < 0.5
      },
      config: Object.assign({}, this.state.config, {
        count: props.count,
        size: props.size,
        char: props.char,
        initStarColor: props.initStarColor,
        selectedStarFillColor: props.selectedStarFillColor,
        half: props.half,
        edit: props.edit
      })
    })
  }

  isDecimal(value) {
    return value % 1 !== 0
  }

  getRate() {
    let stars
    if (this.state.config.half) {
      stars = Math.floor(this.state.value)
    } else {
      stars = Math.round(this.state.value)
    }
    return stars
  }

  getStars(activeCount) {
    if (typeof activeCount === 'undefined') {
      activeCount = this.getRate()
    }
    let stars = []
    for (let i = 0; i < this.state.config.count; i++) {
      stars.push({
        active: i <= activeCount - 1
      })
    }
    return stars
  }

  mouseOver(event) {
    let { config, halfStar } = this.state
    if (!config.edit) return;
    let index = Number(event.target.getAttribute('data-index'))
    if (config.half) {
      const isAtHalf = this.moreThanHalf(event, config.starSize)
      halfStar.hidden = isAtHalf
      if (isAtHalf) index = index + 1
      halfStar.at = index
    } else {
      index = index + 1
    }
    this.setState({
      stars: this.getStars(index)
    })
  }

  moreThanHalf(event, size) {
    let { target } = event
    var mouseAt = event.clientX - target.getBoundingClientRect().left
    mouseAt = Math.round(Math.abs(mouseAt))
    return mouseAt > size / 2
  }

  mouseLeave() {
    const { value, halfStar, config } = this.state
    if (!config.edit) return
    if (config.half) {
      halfStar.hidden = !this.isDecimal(value)
      halfStar.at = Math.floor(this.state.value)
    }
    this.setState({
      stars: this.getStars()
    })
  }

  clicked(event) {
    const { config, halfStar } = this.state
    if (!config.edit) return
    let index = Number(event.target.getAttribute('data-index'))
    let value
    if (config.half) {
      const isAtHalf = this.moreThanHalf(event, config.starSize)
      halfStar.hidden = isAtHalf
      if (isAtHalf) index = index + 1
      value = isAtHalf ? index : index + .5
    
      halfStar.at = index
    } else {
      value = index = index + 1 
    }
    this.setState({
      value: value,
      stars: this.getStars(index)
    })
    this.props.onChange(value)
  }

  renderHalfStarStyleElement() {
    const { config, uniqueness } = this.state
    return (
      <style dangerouslySetInnerHTML={{
        __html: getHalfStarStyles(config.selectedStarFillColor, uniqueness)
      }}></style>
    )
  }

  renderStars() {
    const { halfStar, stars, uniqueness, config } = this.state
    const { initStarColor, selectedStarFillColor, starSize, char, half, edit } = config
    return stars.map((star, i) => {
      let starClass = ''
      if (half && !halfStar.hidden && halfStar.at === i) {
        starClass = `react-stars-${uniqueness}`
      }
      const style = Object.assign({}, starsDefaultStyles, {
        color: star.active ? selectedStarFillColor : initStarColor,
        cursor: edit ? 'pointer' : 'default',
        fontSize: `${starSize}px`
      })
      return (
        <span
          className={starClass}
          style={style}
          key={i}
          data-index={i}
          data-forhalf={char}
          onMouseOver={this.mouseOver.bind(this)}
          onMouseMove={this.mouseOver.bind(this)}
          onMouseLeave={this.mouseLeave.bind(this)}
          onClick={this.clicked.bind(this)}>
          {char}
        </span>
      )
    })
  }

  render() {

    const {
      className
    } = this.props

    return (
      <div className={className} style={parentStyles}>
        {this.state.config.half ?
          this.renderHalfStarStyleElement() : ''}
        {this.renderStars()}
      </div>
    )
  }

}

StarRatingComponent.propTypes = {
  className: PropTypes.string,
  edit: PropTypes.bool,
  half: PropTypes.bool,
  value: PropTypes.number,
  count: PropTypes.number,
  char: PropTypes.string,
  starSize: PropTypes.number,
  initStarColor: PropTypes.string,
  selectedStarFillColor: PropTypes.string
}

StarRatingComponent.defaultProps = {
  edit: true,
  half: true,
  value: 0,
  count: 5,
  char: '★',
  size: 15,
  initStarColor: 'gray',
  selectedStarFillColor: '#333333',

  onChange: () => { }
};

export default StarRatingComponent

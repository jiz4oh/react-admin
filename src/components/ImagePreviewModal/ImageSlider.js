import React from 'react';
import PropTypes from "prop-types";
import _ from 'lodash'
import {LeftOutlined, RightOutlined} from "@ant-design/icons";

import './ImageSlider.scss';

class ImageSlider extends React.PureComponent {
  static propTypes = {
    // 要显示的图片数组, 例子: [{url:aaa, alt:bbb, description:ccc}]
    items: PropTypes.array.isRequired,
  }

  state = {
    previousIndex: 0,
    currentIndex: 0,
  };

  slideTo(index) {
    const {currentIndex} = this.state;
    const slideCount = this.props.items.length - 1;

    let nextIndex = index;
    if (index < 0) {
      nextIndex = slideCount;
    } else if (index > slideCount) {
      nextIndex = 0;
    }

    this.setState({
      previousIndex: currentIndex,
      currentIndex: nextIndex,
    });
  }

  slideLeft = () => this.slideTo(this.state.currentIndex - 1);

  slideRight = () => this.slideTo(this.state.currentIndex + 1);

  /**
   * 将传入的item(一张图片)转换为react元素
   */
  renderImageItem = (item) => (
    <div className="image-gallery-image">
      <img src={item.url} alt={item.alt}/>
      {
        item.description && (
          <span className="image-gallery-description">
            {item.description}
          </span>
        )
      }
    </div>
  )

  renderSlides = () =>
    _.map(this.props.items, (item, index) => (
        <div
          key={index}
          className={`image-gallery-slide${this._getAlignmentClassName(index)}`}
          style={this._getSlideStyle(index)}
        >
          {this.renderImageItem(item)}
        </div>
      )
    )

  renderBullets = currentIndex =>
    _.map(this.props.items, (item, index) =>
      <button
        key={index} type="button"
        className={`image-gallery-bullet ${currentIndex === index ? 'active' : ''}`}
        onClick={e => this.slideTo(index)}
      />
    );

  /*下面这3个方法真心是改不动...css真的苦手...*/

  _getAlignmentClassName(index) {
    // LEFT, and RIGHT alignments are necessary for lazyLoad
    let {currentIndex} = this.state;
    let alignment = '';
    const LEFT = 'left';
    const CENTER = 'center';
    const RIGHT = 'right';

    switch (index) {
      case (currentIndex - 1):
        alignment = ` ${LEFT}`;
        break;
      case (currentIndex):
        alignment = ` ${CENTER}`;
        break;
      case (currentIndex + 1):
        alignment = ` ${RIGHT}`;
        break;
      default:
        break
    }

    if (this.props.items.length > 2) {
      if (index === 0 && currentIndex === this.props.items.length - 1) {
        // set first slide as right slide if were sliding right from last slide
        alignment = ` ${RIGHT}`;
      } else if (index === this.props.items.length - 1 && currentIndex === 0) {
        // set last slide as left slide if were sliding left from first slide
        alignment = ` ${LEFT}`;
      }
    }

    return alignment;
  }

  _getTranslateXForTwoSlide(index) {
    // For taking care of infinite swipe when there are only two slides
    const {currentIndex, offsetPercentage = 0, previousIndex} = this.state;
    const baseTranslateX = -100 * currentIndex;
    let translateX = baseTranslateX + (index * 100);

    // keep track of user swiping direction
    if (offsetPercentage > 0) {
      this.direction = 'left';
    } else if (offsetPercentage < 0) {
      this.direction = 'right';
    }

    // when swiping make sure the slides are on the correct side
    if (currentIndex === 0 && index === 1 && offsetPercentage > 0) {
      translateX = -100 + offsetPercentage;
    } else if (currentIndex === 1 && index === 0 && offsetPercentage < 0) {
      translateX = 100 + offsetPercentage;
    }

    if (currentIndex !== previousIndex) {
      // when swiped move the slide to the correct side
      if (previousIndex === 0 && index === 0 &&
        offsetPercentage === 0 && this.direction === 'left') {
        translateX = 100;
      } else if (previousIndex === 1 && index === 1 &&
        offsetPercentage === 0 && this.direction === 'right') {
        translateX = -100;
      }
    } else {
      // keep the slide on the correct slide even when not a swipe
      if (currentIndex === 0 && index === 1 &&
        offsetPercentage === 0 && this.direction === 'left') {
        translateX = -100;
      } else if (currentIndex === 1 && index === 0 &&
        offsetPercentage === 0 && this.direction === 'right') {
        translateX = 100;
      }
    }

    return translateX;
  }

  _getSlideStyle(index) {
    const {currentIndex, offsetPercentage = 0} = this.state;
    const {items} = this.props;
    const baseTranslateX = -100 * currentIndex;
    const totalSlides = items.length - 1;

    // calculates where the other slides belong based on currentIndex
    let translateX = baseTranslateX + (index * 100) + offsetPercentage;

    // adjust zIndex so that only the current slide and the slide were going
    // to is at the top layer, this prevents transitions from flying in the
    // background when swiping before the first slide or beyond the last slide
    let zIndex = 1;
    if (index === currentIndex) {
      zIndex = 3;
    } else if (index === this.state.previousIndex) {
      zIndex = 2;
    } else if (index === 0 || index === totalSlides) {
      zIndex = 0;
    }

    if (items.length > 2) {
      if (currentIndex === 0 && index === totalSlides) {
        // make the last slide the slide before the first
        translateX = -100 + offsetPercentage;
      } else if (currentIndex === totalSlides && index === 0) {
        // make the first slide the slide after the last
        translateX = 100 + offsetPercentage;
      }
    }

    // Special case when there are only 2 items with infinite on
    if (items.length === 2) {
      translateX = this._getTranslateXForTwoSlide(index);
    }

    const translate3d = `translate3d(${translateX}%, 0, 0)`;
    return {
      WebkitTransform: translate3d,
      MozTransform: translate3d,
      msTransform: translate3d,
      OTransform: translate3d,
      transform: translate3d,
      zIndex: zIndex,
      transition: 'transform 450ms ease-out',  // 这个450ms本来是props中传过来的, 这里写死了
    };
  }

  render() {
    const {currentIndex} = this.state;
    const {items} = this.props;

    // 左右切换按钮
    const slideBtn = (
      <span className="image-gallery-nav-container">
        <div className="left"
             onClick={this.slideLeft}>
          <LeftOutlined/>
        </div>
        <div className="right"
             onClick={this.slideRight}>
          <RightOutlined/>
        </div>
      </span>
    )

    // 下方圆点
    const bulletsNav = (
      <div className="image-gallery-bullets-container">
        <ul className="image-gallery-bullets">
          {this.renderBullets(currentIndex)}
        </ul>
      </div>
    )

    // 右上角index
    const indexPreview = (
      <div className="image-gallery-index-container">
        <span className="current">{currentIndex + 1}</span>
        <span className="separator">{' / '}</span>
        <span className="total">{items.length}</span>
      </div>
    )

    return (
      <section className="image-gallery">
        <div className="image-gallery-content">
          <div className="image-gallery-slide-wrapper">
            {/*图片*/}
            <div className="image-gallery-slides">
              {this.renderSlides()}
            </div>
            {items.length > 1 && [slideBtn, bulletsNav, indexPreview]}
          </div>
        </div>
      </section>
    );
  }
}

export default ImageSlider;

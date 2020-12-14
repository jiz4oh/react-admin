import React from "react";
import _ from "lodash";

const renderImageArr = (strOrArr) => {
  let result = _.cloneDeep(strOrArr);
  if (!_.isArray(result)) {
    result = [result]
  }
  return result.map(str => {
    return {
      url: str,
      alt: '图片加载失败',
    }
  })
}

const ImageRender = (onClickFn) =>
  (rawText, _record) => {
    // 若有多张图片，取第一张为缩略图
    const thumb = _.isArray(rawText) ? rawText[0] : rawText
    const onClick = () => thumb && _.isFunction(onClickFn) && onClickFn(renderImageArr(rawText))
    return <img
      src={thumb}
      alt={'图片加载失败'}
      style={{width: '100%'}}
      onClick={onClick}
    />
  }

export default ImageRender

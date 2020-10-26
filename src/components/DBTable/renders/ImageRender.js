import React from "react";
import _ from "lodash";

import { logger } from '../../ImagePreviewModal/utils'

const renderImageArr = (strOrArr = []) => {
  let result = _.cloneDeep(strOrArr);
  if (_.isString(strOrArr) && strOrArr.length > 0) {
    result = [result]
  }
  return result.map(str => {
    return {
      url: str,
      alt: '图片加载失败',
    }
  })
}

const ImageRender = (onClick) =>
  (rawText, _record) => {
    // 若有多张图片，取第一张为缩略图
    const thumb = _.isArray(rawText) ? rawText[0] : rawText
    return <img
      src={thumb}
      alt={'图片加载失败'}
      style={{width: '100%'}}
      onClick={() => {
        logger.debug('点击预览')
        const imgArr = renderImageArr(rawText)
        _.isFunction(onClick) && onClick(imgArr)
      }}
    />
  }

export default ImageRender

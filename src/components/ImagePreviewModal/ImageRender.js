import React from "react";
import {useDispatch} from "react-redux";
import _ from "lodash";

import {logger} from './utils'
import {actionCreators} from "./store";

const renderImageArr = strOrArr => {
  const result = [];
  if (_.isString(strOrArr) && strOrArr.length > 0) {
    result.push({url: strOrArr, alt: '图片加载失败'});
  } else if (_.isArray(strOrArr)) {
    for (const tmp of strOrArr) {
      result.push({url: tmp, alt: '图片加载失败'});
    }
  }
  return result
}

const ImageRender = (rawText, record) => {
  const dispatch = useDispatch()
  const renderImg = src => (
    <img
      src={src}
      alt={'图片加载失败'}
      style={{width: '100%'}}
      onClick={() => {
        logger.debug('点击预览')
        const imgArr = renderImageArr(rawText)
        dispatch(actionCreators.showPreview(imgArr))
      }}
    />
  )

  const result = _.isArray(rawText) ? rawText[0] : rawText
  return renderImg(result)
}

export default ImageRender
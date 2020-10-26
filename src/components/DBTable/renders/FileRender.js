import _ from "lodash";
import React from "react";

const renderATag = url => (
  <a
    href={url}
    rel="noopener noreferrer"
    target="_blank">{_.last(url.split('/'))}
  </a>
)

const FileRender = (rawText, record) => {
  let result
  if (_.isString(rawText) && rawText.length > 0) {
    // 单个文件, 显示为超链接
    result = renderATag(rawText);
  } else if (!_.isEmpty(rawText)) {
    // 多个文件, 显示为一组超链接
    const urlArray = [];
    for (const i of rawText) {
      urlArray.push(renderATag(rawText[i]))
      urlArray.push(<br key={`br${i}`}/>)
    }
    result = <div>{urlArray}</div>;
  }

  return result;
}

export default React.memo(FileRender)

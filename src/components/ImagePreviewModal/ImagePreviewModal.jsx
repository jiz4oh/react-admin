import React, { useCallback, useMemo } from "react";
import { Modal } from "antd";
import _ from 'lodash'

import './ImagePreviewModal.scss'
import ImageSlider from "./ImageSlider";
import PropTypes from "prop-types";

function ImagePreviewModal({
                             onChange,
                             value,
                           }) {
  const handleCancel = useCallback(() => {
    _.isFunction(onChange) ? onChange([]) : console.warn('未传入 onChange，无法取消 ImagePreviewModal')
  }, [onChange])

  const visible = useMemo(() => !_.isEmpty(value), [value])
  return (
    <Modal
      className='image-preview-modal'
      visible={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <ImageSlider items={value}/>
    </Modal>
  )
}

ImagePreviewModal.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.array.isRequired,
}

export default React.memo(ImagePreviewModal)

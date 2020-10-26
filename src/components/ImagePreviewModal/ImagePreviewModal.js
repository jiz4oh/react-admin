import React, { useCallback, useState } from "react";
import { Modal } from "antd";

import './ImagePreviewModal.scss'
import ImageSlider from "./ImageSlider";

function ImagePreviewModal({
                             visible = false,
                             items,
                             onCancel,
                           }) {
  const [previewVisible, setVisitable] = useState(visible)
  const [previewImages, setPreviewImages] = useState(items || [])

  const handleCancel = useCallback(() => {
    setVisitable(false)
    setPreviewImages([])
  }, [])

  onCancel = onCancel || handleCancel
  items = items || previewImages

  return (
    <Modal
      className='image-preview-modal'
      visible={previewVisible}
      onCancel={onCancel}
      footer={null}
    >
      <ImageSlider items={items}/>
    </Modal>
  )
}

export default React.memo(ImagePreviewModal)

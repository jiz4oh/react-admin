import React, {useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Modal} from "antd";

import './ImagePreviewModal.scss'
import ImageSlider from "./ImageSlider";
import {actionCreators} from "./store";

function ImagePreviewModal() {
  const dispatch = useDispatch()
  const cancelPreview = useCallback(() => dispatch(actionCreators.cancelPreview()), [dispatch])
  const previewVisible = useSelector(state => state.imagePreview.previewVisible)
  const previewImages = useSelector(state => state.imagePreview.previewImages)

  return (
    <Modal
      className='image-preview-modal'
      visible={previewVisible} footer={null}
      onCancel={cancelPreview}
    >
      <ImageSlider items={previewImages}/>
    </Modal>
  )
}

export default React.memo(ImagePreviewModal)
import constants from './constants'

export function cancelPreview() {
  return {type: constants.CANCEL_PREVIEW}
}

export function showPreview(previewImages) {
  return {type: constants.SHOW_PREVIEW, payload: previewImages}
}

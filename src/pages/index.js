import loadable from "@loadable/component";

const dynamic = page => loadable(() => import(`./${page}`))

export default dynamic

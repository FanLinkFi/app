declare module '*.module.scss' {
  const classes: { [className: string]: string }
  export default styles
}
// may be deprecated because next js supports SCSS-modules from the box

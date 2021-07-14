const SvgLayer = (props) => {
    return (
      <svg id={props.id}
      height={props.height}
      width={props.width}
      style={{
        border: "2px solid gold"
      }} />
    )
  }
  export default SvgLayer;
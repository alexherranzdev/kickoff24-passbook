const CameraIcon = ({stroke = '#264788', ...props}) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={64} height={64} {...props}>
    <g data-name='Group 109'>
      <g
        data-name='Ellipse 18'
        style={{
          stroke,
          fill: '#fff'
        }}>
        <circle
          cx={32}
          cy={32}
          r={32}
          stroke='none'
          style={{
            stroke: 'none'
          }}
        />
        <circle
          cx={32}
          cy={32}
          r={31.5}
          style={{
            fill: 'none'
          }}
        />
      </g>
      <g data-name='Icon feather-camera'>
        <path
          d='M34.5 28.5a3 3 0 0 1-3 3h-27a3 3 0 0 1-3-3V12a3 3 0 0 1 3-3h6l3-4.5h9l3 4.5h6a3 3 0 0 1 3 3z'
          data-name='Path 300'
          style={{
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: 3,
            fill: 'none',
            stroke
          }}
          transform='translate(14 14)'
        />
        <path
          d='M24 19.5a6 6 0 1 1-6-6 6 6 0 0 1 6 6z'
          data-name='Path 301'
          style={{
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: 3,
            fill: 'none',
            stroke
          }}
          transform='translate(14 14)'
        />
      </g>
    </g>
  </svg>
)

export default CameraIcon

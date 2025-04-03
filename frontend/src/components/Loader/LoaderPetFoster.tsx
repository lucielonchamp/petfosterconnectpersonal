import { CircularProgress } from "@mui/material"

export const LoaderPetFoster = () => {
  return (
    <><svg width={0} height={0}>
      <defs>
        <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#34748e" />
          <stop offset="100%" stopColor="#5B6B94" />
        </linearGradient>
      </defs>
    </svg>
      <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
    </>
  )
}
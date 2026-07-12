interface SectionWaveProps {
  color?: string
  reverse?: boolean
}

export default function SectionWave({ color = '#f5ead6', reverse }: SectionWaveProps) {
  return (
    <div className={`relative w-full h-[50px] sm:h-[60px] md:h-[74px] overflow-hidden -mt-px`}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 2880 74.39"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={reverse ? { transform: 'rotate(180deg) scaleY(-1)' } : undefined}
      >
        <path
          d="M1347,20.59c-80.5-1.51-227.4-18.93-387-15.94s-320.4,15.94-480,18.93S193.2,8.63,114,2.66s-114,0-114,0V74.39H1440s80.4,0,80.4,0h1359.6V2.66l-80.4,5.98c-79.2,5.98-240,14.45-399.6,11.46-159.6-2.99-294.11,12.58-480,.49-156.5-10.18-320.4-11.95-399.6-5.97,0,0-60.26,5.23-80.4,5.98-23.23,.86-93,0-93,0Z"
          fill={color}
          fillRule="evenodd"
        />
      </svg>
    </div>
  )
}

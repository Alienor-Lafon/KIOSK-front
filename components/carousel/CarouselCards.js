import React from 'react'
import { View } from "react-native"
import Carousel, {Pagination} from 'react-native-snap-carousel'

import CarouselCardItem, { SLIDER_WIDTH, ITEM_WIDTH } from './CarouselCardItem'
import data from './data'
//définit les cartes du carousel
const CarouselCards = () => {
  const isCarousel = React.useRef(null)
  const [index, setIndex] = React.useState(0)
  
  return (
    <View>
      <Carousel
        layout="default"
        layoutCardOffset={9}
        ref={isCarousel}
        data={data}
        renderItem={CarouselCardItem}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH}
        inactiveSlideShift={0}
        useScrollView={true}
        onSnapToItem={(index) => setIndex(index) }
        enableMomentum={true}
        enableSnap={true}
        lockScrollWhileSnapping={true}
        activeAnimationType={'decay'}
      />
      <Pagination
  dotsLength={data.length}
  activeDotIndex={index}
  carouselRef={isCarousel}
  dotColor = "#F24444"
  inactiveDotColor ="#FFFFFF"
  dotStyle={{
    width: 12,
    height: 12,
    borderRadius: 7,
    marginHorizontal: 0
  
  }}
  inactiveDotOpacity={0.4}
  inactiveDotScale={0.6}
  tappableDots={true}
/>
    </View>
  )
}


export default CarouselCards
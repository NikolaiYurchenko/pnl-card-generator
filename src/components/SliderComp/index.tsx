import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FiArrowRightCircle, FiArrowLeftCircle } from "react-icons/fi";
import { useRef } from "react";
import {useResponsive} from "../../hooks/useResponsive.ts";
import './index.css'

type SliderProps = {
  data: string[];
  slideNum: number;
  autoplay: boolean;
  autoplaySpeed: number;
}

export const SliderComp = ({
   data,
   slideNum,
   autoplay,
   autoplaySpeed
 }: SliderProps) => {
  const { screenType } = useResponsive();
  const sliderRef = useRef(null);
  const settings = {
    dots: false,
    infinite: true,
    swipeToSlide: false,
    autoplay: autoplay,
    autoplaySpeed: autoplaySpeed,
    arrows: false,
    slidesToShow: screenType === "MOBILE" ? 2 : slideNum,
    slidesToScroll: 1,
  };

  return (
      <>
      <div className="carouselContainer">
        <div className="carouselWrapper">
          {screenType !== "MOBILE" && (
              <div onClick={() => sliderRef?.current?.slickPrev()} className="prev">
            <FiArrowLeftCircle style={{ fontSize: 24 }} />
            </div>
          )}

          <Slider {...settings} ref={sliderRef}>
              {data?.length > 0 &&
              data?.map((imageUrl: string) => (
                  <div key={imageUrl} className="imagePreviewSlide bg-image-container">
                    <img className="imagePreviewSlideImage" src={imageUrl} alt={imageUrl}/>
                    <a id='downloadButton' href={imageUrl} download="pnl-image.png">
                      Download
                    </a>
                  </div>
              ))}
          </Slider>
          {screenType !== "MOBILE" && (
              <div onClick={() => sliderRef?.current?.slickNext()} className="next">
                <FiArrowRightCircle style={{fontSize: 24}}/>
              </div>
          )}
        </div>
      </div>
    </>
  );
};

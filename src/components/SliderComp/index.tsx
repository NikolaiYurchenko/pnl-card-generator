import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FiArrowRightCircle, FiArrowLeftCircle } from "react-icons/fi";
import { useRef} from "react";
import {useResponsive} from "../../hooks/useResponsive.ts";
import './index.css'
import {CardData} from "../PnlCard";

type SliderProps = {
  data: CardData[];
  slideNum: number;
  autoplay: boolean;
  autoplaySpeed: number;
}

export const SliderComp = ({
   data,
   slideNum = 1,
   autoplay,
   autoplaySpeed
 }: SliderProps) => {
  const { screenType } = useResponsive();
  const sliderRef = useRef<Slider>(null);
  const settings = {
    dots: false,
    infinite: true,
    swipeToSlide: false,
    autoplay: autoplay,
    autoplaySpeed: autoplaySpeed,
    arrows: false,
    slidesToShow: slideNum,
    slidesToScroll: 1,
  };

  // @ts-ignore
  return (
      <>
      <div className="carouselContainer">
        <div className="carouselWrapper">
          {screenType !== "MOBILE" && data?.length > 1 && (
              <div onClick={() => sliderRef?.current?.slickPrev()} className="prev">
            <FiArrowLeftCircle style={{ fontSize: 24 }} />
            </div>
          )}

          <Slider {...settings} ref={sliderRef}>
            {data?.length > 0 &&
              data?.map((cd, index) => (
                  <div key={index} className="imagePreviewSlide bg-image-container">
                    <div className="infoContainer">
                      <p className="infoLabel">Chart data:</p><span className="infoValue">{cd.chartType}</span>
                    </div>
                    <div className="infoContainer">
                      <p className="infoLabel">Bg image:</p><span className="infoValue">{cd.imageName}</span>
                    </div>
                    <div className="infoContainer">
                      <p className="infoLabel"> </p>
                      <a id='downloadButton' href={cd.imageUrl} download="pnl-image.png">
                        Download
                      </a>
                    </div>
                    <img className="imagePreviewSlideImage" src={cd.imageUrl} alt={cd.imageUrl}/>
                  </div>
              ))}
          </Slider>
          {screenType !== "MOBILE" && data?.length > 1 && (
              <div onClick={() => sliderRef?.current?.slickNext()} className="next">
                <FiArrowRightCircle style={{fontSize: 24}}/>
              </div>
          )}
        </div>
      </div>
    </>
  );
};

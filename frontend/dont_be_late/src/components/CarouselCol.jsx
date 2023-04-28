import Carousel from 'react-bootstrap/Carousel';
import "./CarouselCol.css"

//Carousel is a component that is displayed on the home page, showing the types of events that may be offered by our platform
function CarouselCol() {
  return (
    <Carousel style={{display: "block", width: "100%", height: '60vh', marginBottom: "2%", marginLeft: "auto", marginRight: "auto", objectFit: "contain"}}>
      <Carousel.Item>
        <img
          src="/camping.jpeg"
          style={{display: "block", width: '100%', height: "60vh", marginLeft: "auto", marginRight: "auto"}}
          alt="First slide"
        />
        <Carousel.Caption>
          <h5><img className='logo' src={'/dont-be-late.png'}/><div>... to a camping trip!</div></h5>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          src="/camp.jpg"
          style={{display: "block", width: '100%', height: "60vh", marginLeft: "auto", marginRight: "auto"}}
          alt="Second slide"
        />
        <Carousel.Caption>
          <h5><img className='logo' src={'/dont-be-late.png'}/><div>... to a hike!</div></h5>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          src="/social.jpg"
          style={{display: "block", width: '100%', height: "60vh", marginLeft: "auto", marginRight: "auto"}}
          alt="Second slide"
        />
        <Carousel.Caption>
          <h5><img className='logo' src={'/dont-be-late.png'}/><div>... to networking events!</div></h5>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          src="/rave.jpg"
          style={{display: "block", width: '100%', height: "60vh", marginLeft: "auto", marginRight: "auto"}}
          alt="Second slide"
        />
        <Carousel.Caption>
          <h5><img className='logo' src={'/dont-be-late.png'}/><div>... to live events!</div></h5>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          src="/tour.jpg"
          style={{display: "block", width: '100%', height: "60vh", marginLeft: "auto", marginRight: "auto"}}
          alt="Second slide"
        />
        <Carousel.Caption>
          <h5><img className='logo' src={'/dont-be-late.png'}/><div>... to tours!</div></h5>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          src="/competition.jpg"
          style={{display: "block", width: '100%', height: "60vh", marginLeft: "auto", marginRight: "auto"}}
          alt="Second slide"
        />
        <Carousel.Caption>
          <h5><img className='logo' src={'/dont-be-late.png'}/><div>... to competitions!</div></h5>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default CarouselCol;
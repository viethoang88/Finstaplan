import { Galleria } from "primereact/galleria";
import PhotoService from "../../../src/libs/photo-service";
// see https://www.primefaces.org/primereact/showcase/#/galleria

const itemTemplate = (item) => {
  return (
    <img src={item.itemImageSrc} alt={item.alt} style={{ width: "100%" }} />
  );
};

const thumbnailTemplate = (item) => {
  return (
    <div style={{ maxHeight: "250px", maxWidth: "125px", marginRight: "35px" }}>
      <img src={item.thumbnailImageSrc} alt={item.alt} />
    </div>
  );
};

// PhotoService returns an array of
const DisplayAttachments = ({ clientId, paths }) => {
  const images = PhotoService.getImages(clientId, paths);
  const DUMMY_IMAGES = [
    {
      itemImageSrc: "/assets/images/temp/med0.jpg",
      thumbnailImageSrc: "/assets/images/temp/med0.jpg",
      alt: "medical image",
      title: "medical image",
    },
    {
      itemImageSrc: "/assets/images/temp/med1.png",
      thumbnailImageSrc: "/assets/images/temp/med1.png",
      alt: "medical image",
      title: "medical image",
    },
    {
      itemImageSrc: "/assets/images/temp/med2.png",
      thumbnailImageSrc: "/assets/images/temp/med2.png",
      alt: "medical image",
      title: "medical image",
    },
  ];

  return (
    <div>
      <Galleria
        value={DUMMY_IMAGES}
        // responsiveOptions={this.responsiveOptions}
        numVisible={5}
        style={{ maxWidth: "640px" }}
        item={itemTemplate}
        thumbnail={thumbnailTemplate}
      />
    </div>
  );
};

export default DisplayAttachments;

import React from "react";
import { Map, Placemark, YMaps } from "react-yandex-maps";
const Map1 = () => {
  return (
    <YMaps>
      <div>
        <Map
          defaultState={{
            center: [38.847244, 65.788283],
            zoom: 5,
          }}
        >
            <Placemark geometry={[38.847244, 65.788283]}/>
        </Map>
      </div>
    </YMaps>
  );
};

export default Map1;

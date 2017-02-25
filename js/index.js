const remote = require("electron").remote
const bb = require("bluebird");
const db = remote.getGlobal("coon");

let myMap;
ymaps.ready(function () {
  myMap = new ymaps.Map("yamap", {
    center: [55.76, 37.64],
    zoom: 10
  });
  new ymaps.GeoObject({
    geometry: {
      type: "Circle",
      coordinates: [55.76, 37.64],
      radius: 10000
    }
  });

  let tasks = [];
  let cnt = 1;

  let toBase = (it)=>{
      let data  = it.next();
      let row = data.value;
      ymaps.geocode(`${row.metro} ${row.street} ${row.house_number}`)
        .then(res => {
          "use strict";
          let resObj = {}
          let coords = res.geoObjects.get(0).geometry.getCoordinates();
          resObj.coord = coords;
          return resObj
        })
        .then(resObj => {
          "use strict";
          return ymaps.geocode(resObj.coord, {kind: 'district'})
            .then((res) => {
                var street = res.geoObjects.get(0);
                var name = street.properties.get('name');
                resObj.district = name;
                return resObj
              }
            );
        })
        .then(resObj => {
          "use strict";
          return ymaps.geocode(resObj.coord, {kind: 'metro'})
            .then((res) => {
                var street = res.geoObjects.get(0);
                var name = street.properties.get('name');
                resObj.metroName = name;
                return resObj
              }
            );
        })
        .then(resObj => {
          "use strict";
          return ymaps.route([{
            type: 'wayPoint',
            point: resObj.coord
          }, resObj.metroName], {routingMode:"masstransit", multiRoute: true})
            .then(r => {
              resObj.distance =  r.getActiveRoute().properties.get("distance");
              resObj.duration =  r.getActiveRoute().properties.get("duration");
              return resObj
            })
        })
        .then(resObj => {
          "use strict";
          return ymaps.route([{
            type: 'wayPoint',
            point: resObj.coord
          }, "метро Охотный Ряд"])
            .then(r => {
              resObj.distance_center =  r.getLength();
              resObj.duration_center =  r.getJamsTime();
              return resObj
            })
        })
        .then(resObj=>{
          "use strict";
          console.log(resObj);
          console.log(cnt--);
          db.run(`UPDATE address SET metro_name='${resObj.metroName}', district='${resObj.district}', distance_center='${resObj.distance_center}',duration_center='${resObj.duration_center}',distance_metro='${resObj.distance.value}',duration_metro='${resObj.duration.value}', lat='${resObj.coord[0]}',lad='${resObj.coord[1]}' where observation='${row.observation}'`);
          if(!data.done){
            toBase(it)
          }
        })
        .catch(err => {
          "use strict";
          console.log(err)
          console.log(cnt--);
          db.run(`UPDATE address SET metro_name='error' WHERE observation='${row.observation}'`)
          if(!data.done){
            toBase(it)
          }
        })
    }

    db.each("SELECT DISTINCT address.metro, address.street, address.house_number, address.observation FROM address WHERE metro_name ISNULL", (err, row) => {
    "use strict";
    console.log(cnt++);
    tasks.push(row)
  }).then(res=>{
    "use strict";
      function* iter() {
       for (let k in tasks) {
         yield tasks[k]
       }
     }
     let it = iter();
      toBase(it)
  })
});


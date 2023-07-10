// Problem Statement
// Build a simplified cab booking platform
// Requirements
// 1. User location and cab location are represented with (x,y) coordinates
// 2. Distance between any two location (x1, y1) and (x2, y2) can be
// calculated using √((x2-x1)2+(y2-y1)2)
// 3. Booking of a cab is not allowed if the distance between user location
// and cab location is more than specified threshold, this threshold should
// be configurable.
// 4. Assume that only one type of cab exist in our system no need to build
// a generic solution
//
// 5. Assume that ride sharing is not allowed
// Features
// Please build an application to support the following features.
// 1. Register a rider
// 2. Register a driver
// 3. Start trip by assigning a rider to a driver based on the nearest cab
// 4. A driver can change his availability on/off
// 5. If driver availability is changed from off to on,the cab's location should
// be changed.
// 6. End trip

//  drivers list
// exposes the function register the dri
// exposes the function search Rider
// exposes the function Switch Avalibili u ch
function MakeDriverList(default_threshold = 10) {
  let driver_list = [];
  let _thresh_old = default_threshold;
  return Object.freeze({ RegisterDriver, UpdateAvailibility, SearchDriver })



  /**
     * it registers the users with initial qoordinates and with availability true
     * @param {*} x 
     * @param {*} y 
     */
  function RegisterDriver(x_coordinate, y_coordinate) {
    let driver = MakeDriver(x_coordinate, y_coordinate);
    driver_list.push(driver);
    return driver;
  }

  function MakeDriver(x, y, avilibility = true) {
    return {
      _id: Date.now() + Math.random(),
      location: {
        x_coordinate: x,
        y_coordinate: y,
      },
      avilibility
    }
  }
  // update the availability in case of end trip or break
  function UpdateAvailibility(driver_id, availability, { x_coordinate, y_coordinate }) {
    if (!driver_id) throw Error(`driver_id: is required `);
    if (typeof availability !== 'boolean') throw Error(`availability: is required and should be boolean`);

    let driver_position = driver_list.findIndex((driver) => {
      return driver._id === driver_id;
    });
    // driver found
    if (driver_position > -1) {
      driver_list[driver_position].availability = availability;

      if (availability) {

        driver_list[driver_position].location = { x_coordinate, y_coordinate };
      }
      // console.log('update availibitly', driver_list[driver_position])
      return { result: driver_list[driver_position], success: true, }
    } else {
      return { result: null, success: false, messsge: 'driver does not exists' }

    }
  }
  /**
     * 
     * @param {*} x x coordinate
     * @param {*} y y coordinate
     * @param {*} meta_data user specific data for further uses 
     */
  function SearchDriver(x, y, meta_data = {}) {

    let selected_drivers = driver_list.filter((driver) => {
      if (driver.avilibility === true) {
        const driver_location = driver.location;
        const user_location = { x, y };
        let distance_between_driver = ComputeDistance({
          x: driver_location.x_coordinate,
          y: driver_location.y_coordinate
        }, user_location)



        // console.log(  distance_between_driver)



        if (distance_between_driver <= _thresh_old) {
          console.log(distance_between_driver, 'passed')
          return true;
        } else {
          console.log(distance_between_driver, 'failed')
          return false
        }
      } else {
        return false
      }
    });

    // assign the distance [this could be done in previous stage it self]
    selected_drivers.map((driver) => {
      const driver_location = driver.location;
      const user_location = { x, y };
      let distance_between_driver = ComputeDistance({
        x: driver_location.x_coordinate,
        y: driver_location.y_coordinate
      }, user_location)
      driver.distance = distance_between_driver;
      return driver;
    })

    return selected_drivers.sort((a, b) => { return b.distance - a.distance });
  }


  function ComputeDistance(point_1, point_2) {
    // validation to be implemented
    let point_1_x = point_1.x;
    let point_1_y = point_1.y;
    let point_2_x = point_2.x;
    let point_2_y = point_2.y;

    // implement computation logic
    // √((x2-x1)2+(y2-y1)2)
    let distance = Math.sqrt((point_2_x - point_1_x) ** 2 + (point_2_y - point_1_y) ** 2)


    return distance;
  }


}

function MakeRiderList() {
  let rider_list = [];

  return { RegisterRider }
  function RegisterRider(x_coordinate, y_coordinate) {
    let rider = MakeRider(x_coordinate, y_coordinate);
    rider_list.push(rider_list);
    return rider
  }
  function MakeRider(x_coordinate, y_coordinate) {
    return { location: { x_coordinate, y_coordinate }, _id: Date.now() + Math.random() }
  }
}


// this object handle the logic of booking cab and ending the trip
function CabBookService(driver_logic) {
  let my_trip = [];
  return {
    BookCab(rider) {
      let location_obj = rider.location;
      let result = driver_logic.SearchDriver(location_obj.x_coordinate, location_obj.y_coordinate);

      // if rider is found 
      if (result.length) {
        let top_driver = result[0]

        //  set availability to false
        let update_avalibilitiy_result = driver_logic.UpdateAvailibility(top_driver._id, false, {});




        if (update_avalibilitiy_result.success === true) {
          return { result: update_avalibilitiy_result.result, message: '', success: true }

        } else {

          return { result: null, message: update_avalibilitiy_result.message, success: false }
        }
      } else {
        return { result: null, message: 'no driver found in range', success: false }
      }
      // console.log('result', result)
    },
    EndTrip(driver) {
      let location_obj = driver.location;
      let update_avalibilitiy_result = driver_logic.UpdateAvailibility(driver._id, true, { x: location_obj.x_coordinate, y: location_obj.y_coordinate });
      if (update_avalibilitiy_result.success === true) {
        console.log('trip ended')
        return { result: update_avalibilitiy_result.result, message: '', success: true }

      } else {

        return { result: null, message: update_avalibilitiy_result.message, success: false }
      }
    }
  }
}







let driver_list = MakeDriverList(10)
let rider_list = MakeRiderList();
let new_rider = rider_list.RegisterRider(0, 50);
let new_driver = driver_list.RegisterDriver(0, 5);
let new_driver2 = driver_list.RegisterDriver(0, 4);
let new_driver3 = driver_list.RegisterDriver(0, 12);

let cab_booker = CabBookService(driver_list);
let cab = cab_booker.BookCab(new_rider);

if (cab.success == true) {
  // console.log(cab)
  // console.log()
  let end_trip_result = cab_booker.EndTrip(cab.result);
  // console.log('end', end_trip_result);
} else {
  console.log(cab.message)
}



console.log('new_rider', new_rider, cab)

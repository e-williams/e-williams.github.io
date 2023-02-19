import React, { useState, useMemo, useCallback } from "react";
import "../assets/styles/SearchPageContainer.css";
import vehicleData from "../vehicleData.json";
import SearchContainer from "./SearchContainer";
import ResultsContainer from "./ResultsContainer";

function SearchPageContainer() {
  const [vehicleCheckboxFilters, setVehicleCheckboxFilters] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(0);
    // [state value variable, function to change state] = 0 initial state
  // const inputRef = useRef("hidden");


  const findVehicleIdsMatchingCheckboxFilters = useMemo(
    () => {
      console.log("The filters have changed::: ", vehicleCheckboxFilters);
      // Function that finds all vehicle IDs that match the selected filters.
      // Array of selected filters is initially empty until user input. Then,
      // vehicleCheckboxFilters is updated and this function is re-invoked, due
      // to the change in the dependency array.
      // useMemo produces a memoized CONSTANT for [vehicleIdsMatchingFlilters].
      // CONSTANT is recalculated only if the value of vehicleFilters changes.

      // Need to match data values in vehicleData to elements in vehicleFilters.
      // Parse vehicleData: convert objects within container array to arrays of
      // data values so can iterate over them and match values with filters,
      // using Array.prototype.includes() for example.

      const vehicleDataValues = vehicleData.map((objectData) =>
        Object.values(objectData)
      );
      console.log(
        "vehicleDataValues for checkbox after parsing::",
        vehicleDataValues
      );
      // Produces an array of vehicle data arrays.
      // [[0, "TESLA", ...], [1, "Kia", ...]]

      // Get only vehicle IDs matching filters so can use IDs to match original
      // vehicle object data to pass to ResultsContainer for better output.

      const getVehicleIdsForCheckbox = () => {
        const vehicleIdsMatchingFilters = [];

        vehicleDataValues.forEach((vehicle) => {
          vehicleCheckboxFilters.forEach((filter) => {
            if (vehicle.includes(filter)) {
              vehicleIdsMatchingFilters.push(vehicle[0]);
                // vehicle[0] selects "id" value
            }
          });
        });
        console.log(
          "VehicleIdsMatchingCheckboxFilters are::",
          vehicleIdsMatchingFilters
        );

        return vehicleIdsMatchingFilters; // [0, 2]
      }

      return getVehicleIdsForCheckbox(); // [0, 2]
        // () to return function returned value.
    }, [vehicleCheckboxFilters]
  );

  const handleCheckboxFilterSelection = useCallback(
    (e) => {
      // Function that creates an array of all selected filters and as output,
      // changes the state of vehicleCheckboxFilters.
      // Function is re-invoked whenever a user clicks on a filter.
      // useCallback: upon subsequent renders, if the dependencies haven't
      // changed, returns the stored FUNCTION; otherwise returns (not invokes)
      // re-rendered function.
      // e is parameter name taking on HTML Event() interface.

      // If a checkbox is checked:
      if (e.target.checked) { // if checked = true
        setVehicleCheckboxFilters([...vehicleCheckboxFilters, e.target.id]);
        // checked is <input> attribute = boolean value.
        // Event.target = target property of HTML Event interface - returns
        // the element where the event occured.
        // VALUE of <input> attribute id is added to vehicleFilters.
        // Spread syntax ... to add element id value to new array state; not
        // an array pointing to vehicleFilters memory.
      }
      // If a checkbox is unchecked:
      else if (e.target.checked === false) {
        console.log("value of checked after unchecking is::", e.target.checked);
        const filterIndex = vehicleCheckboxFilters.indexOf(e.target.id);
        console.log({ filterIndex });
        const copyVehicleCheckboxFilters = [...vehicleCheckboxFilters];
          // So array state is new and not pointing to vehicleFilters memory.
        copyVehicleCheckboxFilters.splice(filterIndex, 1);
          // Deletes 1 element at position filterIndex.
        setVehicleCheckboxFilters(copyVehicleCheckboxFilters);
          // ["Model 3", "Kia", ...]
      }
    }, [vehicleCheckboxFilters] // dependency array
  );

  const findVehicleIdsMatchingSelectboxMaxPrice = useMemo((
    ) => {
      // Function finds all the vehicle IDs that match vehicles with a price
      // that is <= filter selection of max price.

      const vehicleIdsMatchingPrice = [];

      vehicleData.forEach((vehicle) => {
        // destructured form:
        // vehicleData.forEach(({base_price}) => {
        const vehiclePrice = vehicle.base_price;

        if (vehiclePrice <= selectedPrice) {
          // selectedPrice is state value
          vehicleIdsMatchingPrice.push(vehicle.id);
        }
      });

      return vehicleIdsMatchingPrice;
    }, [selectedPrice]
  );

  // Merging 2 arrays
  const vehicleIdsAllFilters = () => {
    const duplicateIds = [
      ...findVehicleIdsMatchingCheckboxFilters,
      ...findVehicleIdsMatchingSelectboxMaxPrice,
    ];
      // spread syntax used to combine arrays. Combination contains possible
      // duplicate IDs of same vehicles matching checkboxes & selectboxes.

    const uniqueIds = new Set(duplicateIds); // new to create a new set
      // Set eliminates duplicate IDs. A value in a set can occur only once.

    return Array.from(uniqueIds);
      // Array.from() creates shallow copy of Array instance from an iterable.
  }

  // Function to handle display of all vehicles if no filters selected.
  // 
  const handleResultsRender = () => {
    if (vehicleCheckboxFilters.length === 0 &&
         (selectedPrice === 0 || selectedPrice === "unlimited")) {
      return (
        vehicleData.map((vehicleSpecs) => (
          <ResultsContainer
            key={vehicleSpecs.id}
            filteredVehicleSpecs={vehicleSpecs}
          />
        ))
      );
    } else if (vehicleIdsAllFilters().length > 0) {
      return (
        vehicleIdsAllFilters().map((vehicleId) => (
          <ResultsContainer
            key={vehicleId}
            filteredVehicleSpecs={vehicleData.find(
              (vehicle) => vehicle.id === vehicleId
            )}
          />
        ))
          // map used to produce ResultsContainer for each iteration of
          // vehicleId over JSON object list. Each child element in a mapped
          // list needs a unique key prop.
          // filteredVehicleSpecs is property assigned to output of find(),
          // which returns the 1st element in vehicleData that meets the
          // condition, in this case the object for a vehicle containing keys
          // and values.
      );
    } else {
      return (
        <div id="noResultsMessage">
          NO VEHICLES MATCH THE SELECTED FILTERS.<br/>
          PLEASE REDUCE THE NUMBER OF SELECTIONS.
        </div>
      );
    }
  }


  return (
    <div id="searchPageWrapper">
      <h3 className="searchPageHeadings">
        Select your preferred electric vehicle specifications in the FILTERS
        column below:
      </h3>
      <div id="searchPageFlexbox">
        <section id="flexItemSearch">
          <h2 className="searchPageHeadings">
            FILTERS
          </h2>

          <SearchContainer
            handleCheckboxFilterSelection={handleCheckboxFilterSelection}
            setSelectedPrice={setSelectedPrice}
          />

        </section>
        <section id="flexItemResults">
          <div id="resultsWrapper">

            {handleResultsRender()}

          </div>
        </section>
      </div>
    </div>
  );
}

export default SearchPageContainer;

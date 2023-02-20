import React, { useState, useMemo, useCallback } from "react";
import "../assets/styles/SearchPageContainer.css";
import vehicleData from "../vehicleData.json";
import SearchContainer from "./SearchContainer";
import ResultsContainer from "./ResultsContainer";

function SearchPageContainer() {
  const [vehicleCheckboxFilters, setVehicleCheckboxFilters] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(0);

  const findVehicleIdsMatchingCheckboxFilters = useMemo(
    () => {
      console.log("The checkbox filters have changed::: ",
        vehicleCheckboxFilters);
      // Function that finds all vehicle IDs that match the selected filters.
      // Array of selected filters is initially empty until user input. Then,
      // vehicleCheckboxFilters is updated and this function is re-invoked, due
      // to the change in the dependency array.
      
      // Parse vehicleData: convert objects within container array to arrays of
      // data values so can iterate over them and match values with filters.

      const vehicleDataValues = vehicleData.map((objectData) =>
        Object.values(objectData)
      );
      console.log("vehicleDataValues after parsing::", vehicleDataValues);
      // Produces an array of vehicle data arrays.
      // [[0, "TESLA", ...], [1, "Kia", ...]]

      // Get only vehicle IDs matching filters so can use IDs to match original
      // vehicle object data to pass to ResultsContainer for output.

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
          "VehicleIdsMatchingCheckboxFilters are::", vehicleIdsMatchingFilters
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

      // If a checkbox is checked:
      if (e.target.checked) {
        setVehicleCheckboxFilters([...vehicleCheckboxFilters, e.target.id]);
      }
      // If a checkbox is unchecked:
      else if (e.target.checked === false) {
        console.log("value of checked after unchecking is::", e.target.checked);
        const filterIndex = vehicleCheckboxFilters.indexOf(e.target.id);
        console.log({ filterIndex });
        const copyVehicleCheckboxFilters = [...vehicleCheckboxFilters];
        copyVehicleCheckboxFilters.splice(filterIndex, 1);
        setVehicleCheckboxFilters(copyVehicleCheckboxFilters);
          // ["4-door sedan", "5-door crossover", ...]
      }
    }, [vehicleCheckboxFilters]
  );

  const findVehicleIdsMatchingSelectboxMaxPrice = useMemo((
    ) => {
      // Function finds all the vehicle IDs that match vehicles with a price
      // that is <= filter selection of max price.

      const vehicleIdsMatchingPrice = [];

      vehicleData.forEach(({base_price, id}) => {
        // destructured vehicleData.base_price = parameter
        if (base_price <= selectedPrice) {
          vehicleIdsMatchingPrice.push(id);
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
      // duplicate IDs of same vehicles matching checkboxes & selectboxes.

    const uniqueIds = new Set(duplicateIds);
      // Set eliminates duplicate IDs.

    return Array.from(uniqueIds);
      // Array.from() creates shallow copy of Array instance from an iterable.
  }

  // Function to handle display of all vehicles if no filters selected.
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

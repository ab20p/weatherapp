import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './CitiesTable.css';

export default function CitiesTable(){
    const [cities, setCities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortedColumn, setSortedColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');
    const containerRef = useRef(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&q=${searchTerm}&rows=50`
          );
          setCities(response.data.records);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, [searchTerm]);
  
    const handleSort = (column) => {
      if (column === sortedColumn) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortedColumn(column);
        setSortDirection('asc');
      }
    };
  
    const sortedCities = cities.sort((a, b) => {
      if (!sortedColumn) return 0;
      const aValue = a.fields[sortedColumn];
      const bValue = b.fields[sortedColumn];
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  
    const handleScroll = () => {
      if (
        containerRef.current &&
        containerRef.current.scrollTop + containerRef.current.clientHeight ===
          containerRef.current.scrollHeight
      ) {
        // Fetch more data or implement infinite scroll functionality here
      }
    };
  
    return (
      <div className="CitiesTable" ref={containerRef} onScroll={handleScroll}>
        <input
          type="text"
          placeholder="Search cities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <br />
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>City Name</th>
              <th onClick={() => handleSort('country')}>Country</th>
              <th onClick={() => handleSort('countrycode')}>Country Code</th>
              <th onClick={() => handleSort('population')}>Population</th>
              <th onClick={() => handleSort('timezone')}>Timezone</th>
            </tr>
          </thead>
          <tbody>
            {sortedCities.map((city) => (
              <tr key={city.recordid}>
                <td>
                  <Link to={`/weather/${city.fields.name}`}>
                    {city.fields.name}
                  </Link>
                </td>
                <td>{city.fields.cou_name_en}</td>
                <td>{city.fields.country_code}</td>
                <td>{city.fields.population}</td>
                <td>{city.fields.timezone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
}
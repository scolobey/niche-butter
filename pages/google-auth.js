import Head from 'next/head';

import { alertService } from './services/alert.service.js';
import React, { useState } from 'react';
import { useSession, signIn } from "next-auth/react";

import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
// <th>Keys</th>
// <th>Clicks</th>
// <th>Impressions</th>
// <th>CTR</th>
// <th>Position</th>
const columns = [
  { field: 'keys', headerName: 'Keys', width: 250 },
  { field: 'clicks', headerName: 'Clicks', type: 'number', width: 90 },
  { field: 'impressions', headerName: 'Impressions', type: 'number', width: 90 },
  { field: 'ctr', headerName: 'CTR', type: 'number', width: 60 },
  { field: 'position', headerName: 'Position', type: 'number', width: 90 }
];

const GoogleAuth = () => {
  const [options, setOptions] = useState({
    autoClose: true,
    keepAfterRouteChange: false
  });

  const [googleData, setGoogleData] = useState({});

  const [queries, setQueries] = useState([]);

  const [sites, setSites] = useState([]);

  const [selectedSite, setSelectedSite] = useState({});

  const { data: session } = useSession()

  const authorizeGoogle = async () => {
    const response = await fetch('/api/googleAuth', { method: 'POST' });
    const data = await response.json();

    if (data.error) {
      alertService.success(data.message, options)
    } else {
      setGoogleData(data)
    }
  };

  const getQueries = async (site) => {
    let route = '/api/queries/' + encodeURIComponent(site.siteUrl)
    const response = await fetch(route, { method: 'GET' });

    const data = await response.json();

    console.log("queries comin back: " + JSON.stringify(data.data.rows));

    if (data.error) {
      alertService.success(data.message, options)
    } else {
      setQueries(data.data.rows)
    }
  };

  const getSites = async () => {
    const response = await fetch('/api/siteList/', { method: 'GET' });

    const data = await response.json();

    console.log("data: " + JSON.stringify(data));

    if (data.error) {
      alertService.success(data.message, options)
    } else {
      if (data.data && data.data.siteEntry) {
        setSites(data.data.siteEntry)
      }
    }
  };

  const selectProperty = async (ind) => {
    getQueries(sites[ind])

    setSelectedSite(sites[ind])
  };

  React.useEffect(() => {
    if(sites.length == 0) {
      getSites()
    }
  }, [])

  return (
    <div>
      <Head>
        <title>NicheButter </title>
      </Head>

      <div className="text-content">

        {session ? (
          <div>
            {selectedSite && selectedSite.siteUrl ? (
              <div>
                <h2>{selectedSite.siteUrl} queries: {queries && queries.length ? (queries.length) : ("0")}</h2>
                <button className="dismiss" onClick={e => {
                  e.preventDefault();
                  setSelectedSite({});
                  setQueries([]);
                }}>dismiss</button>
                <DataGrid
                  getRowId={(row) => row.keys}
                  rows={queries}
                  columns={columns}
                  rowsPerPageOptions={[20]}
                  checkboxSelection
                  sx={{ height: '650px', width: '950px' }} // either autoHeight or this
                  pageSize={10}
                  // autoHeight
                />
              </div>
            ) : (
              <ul>
                {sites.map((site, index) => (
                  <li key={site.siteUrl + "-" +index} className="site-selector" onClick={e => {
                    e.preventDefault();
                    selectProperty(index);
                  }}>
                    <h2>{site.siteUrl}</h2>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <a className='generate-button' onClick={() => signIn()}>SignIn</a>
        )}

      </div>
    </div>
  );
};

export default GoogleAuth;

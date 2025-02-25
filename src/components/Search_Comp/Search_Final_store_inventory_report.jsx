import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import SearchIcon from '@mui/icons-material/Search';
import BackspaceIcon from '@mui/icons-material/Backspace';

function Search_Final_store_inventory_report({ onSearch }) {
    const [error , setError] = useState(null);

    const [selectedFactory, setSelectedFactory] = useState(null);
    const [selectedLocCode, setSelectedLocCode] = useState(null);
    const [selectedMatItem, setSelectedMatItem] = useState(null);

    const [distinctFactory, setdistinctFactory] = useState([]);
    const [distinctLocCode, setdistinctLocCode] = useState([]);
    const [distinctMatItem, setdistinctMatItem] = useState([]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    const fetchFactorytList = async () => {
        try {
            const response = await axios.get(`http://10.17.66.242:3001/api/smart_sus/filter-factory-list-final-inventory-report`);
            const data  = response.data;
            setdistinctFactory(data);
        } catch (error) {
            console.error(`Error fetching distinct data Factory List: ${error}`);
        }
    };

    const fetchLocCodetList = async () => {
        try {
            let factory_selected = '';
            if (selectedFactory) {
                factory_selected = selectedFactory.factory;
            } else {
                factory_selected = 'All'
            }
            const response = await axios.get(`http://10.17.66.242:3001/api/smart_sus/filter-loc-code-list-final-inventory-report?factory=${factory_selected}`);
            const data  = response.data;
            setdistinctLocCode(data);
        } catch (error) {
            console.error(`Error fetching distinct data Location List: ${error}`);
        }
    };

    const fetchMatitemtList = async () => {
        try {
            let factory_selected = '';
            if (selectedFactory) {
                factory_selected = selectedFactory.factory;
            } else {
                factory_selected = 'All'
            }

            let loc_selected = '';
            if (selectedLocCode) {
                loc_selected = selectedLocCode.loc_code;
            } else {
                loc_selected = 'All'
            }
            console.log('factory_selected',factory_selected);
            console.log('loc_selected',loc_selected);
            
            const response = await axios.get(`http://10.17.66.242:3001/api/smart_sus/filter-mat-item-list-final-inventory-report?factory=${factory_selected}&loc_code=${loc_selected}`);
            const data  = response.data;
            setdistinctMatItem(data);
        } catch (error) {
            console.error(`Error fetching distinct data Mat Item List: ${error}`);
        }
    };

    useEffect(() => {
        fetchFactorytList();
        fetchLocCodetList(); 
        fetchMatitemtList();  
    }, [selectedFactory, selectedLocCode]);

    const handleFactoryChange = (event, newValue) => {
        setSelectedFactory(newValue);
        setSelectedMatItem(null);
        setSelectedLocCode(null);
    }

    const handleLocCodeChange = (event, newValue) => {
        setSelectedLocCode(newValue);
        setSelectedMatItem(null);
    }

    const handleMatItemChange = (event, newValue) => {
        setSelectedMatItem(newValue);
    }

    const handleSearch = () => {
        const factory = selectedFactory == null ? 'All' : selectedFactory.factory;
        const MatItem = selectedMatItem == null ? 'All' : selectedMatItem.mat_item;
        const Location = selectedLocCode == null ? 'All' : selectedLocCode.loc_code;

        const queryParams = {
            factory,
            MatItem,
            Location,
        };
        // console.log('Query Params:', queryParams);
        onSearch(queryParams);
    };

    const handleClear = () => {
        setSelectedFactory(null);
        setSelectedLocCode(null);
        setSelectedMatItem(null);

        const clear_data = 'Clear Data';

        const queryParams = {
            clear_data
        };
        // console.log('Query Params:', queryParams);
        onSearch(queryParams);
    };

    return (
        <React.Fragment>
            <Box maxWidth="xl" sx={{ width: "100%" , height: 80 }}>
                <Grid container spacing={0} style={{width: 1600 }}> 
                    <Grid item xs={2} md={1} >
                        <div style={{ display: 'grid', placeItems: 'center' }}>
                            <Autocomplete
                                disablePortal
                                options={distinctFactory}
                                getOptionLabel={(option) => (option ? String(option.factory) : '')}
                                value={selectedFactory}
                                onChange={handleFactoryChange}
                                sx={{ width: 200 , marginTop: '5px' , backgroundColor: '#F5F7F8'}}
                                isOptionEqualToValue={(option, value) => option.factory === value.factory}
                                renderInput={(params) => <TextField {...params} label="Factory"/>}
                            />
                        </div>
                    </Grid>

                    <Grid item xs={2} md={1} style={{ marginLeft: '80px' }}>
                        <div style={{ display: 'grid', placeItems: 'center' }}>
                            <Autocomplete
                                disablePortal
                                options={distinctLocCode}
                                getOptionLabel={(option) => (option ? String(option.loc_code) : '')}
                                value={selectedLocCode}
                                onChange={handleLocCodeChange}
                                sx={{ width: 200 , marginTop: '5px' , backgroundColor: '#F5F7F8'}}
                                isOptionEqualToValue={(option, value) => option.loc_code === value.loc_code}
                                renderInput={(params) => <TextField {...params} label="Location"/>}
                            />
                        </div>
                    </Grid>

                    <Grid item xs={2} md={1} style={{ marginLeft: '80px' }}>
                        <div style={{ display: 'grid', placeItems: 'center' }}>
                            <Autocomplete
                                disablePortal
                                options={distinctMatItem}
                                getOptionLabel={(option) => (option ? String(option.mat_item) : '')}
                                value={selectedMatItem}
                                onChange={handleMatItemChange}
                                sx={{ width: 200 , marginTop: '5px' , backgroundColor: '#F5F7F8'}}
                                isOptionEqualToValue={(option, value) => option.mat_item === value.mat_item}
                                renderInput={(params) => <TextField {...params} label="Material Item"/>}
                            />
                        </div>
                    </Grid>

                    <Grid  item xs={2} md={1} style={{ marginLeft: '85px' }} >
                        <div style={{ display: 'grid', placeItems: 'center' }}>
                            <Button 
                                variant="contained" 
                                className="btn_hover"
                                // size="small"
                                style={{width: '130px', height: '55px' , marginTop: '5px'}}
                                onClick={handleSearch}
                                endIcon={<SearchIcon />}
                                >Search
                            </Button>
                        </div>
                    </Grid>
                    <Grid  item xs={2} md={1} style={{ marginLeft: '5px' }} >
                        <div style={{ display: 'grid', placeItems: 'center' }}>
                            <Button 
                                variant="contained" 
                                className="btn_hover"
                                // size="small"
                                color="warning"
                                style={{width: '130px', height: '55px' , marginTop: '5px', }}
                                onClick={handleClear}
                                endIcon={<BackspaceIcon />}
                                >Clear
                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </Box>
        </React.Fragment>
    );
}

export default Search_Final_store_inventory_report
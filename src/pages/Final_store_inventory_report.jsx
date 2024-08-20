import React, { useState, useEffect , useRef } from "react";
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import './styles/Final_store_inventory_report.css'; // Import the CSS file
import axios from "axios";
import { GlobalStyles } from '@mui/material';
import Button from '@mui/material/Button';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CancelIcon from '@mui/icons-material/Cancel';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Swal from 'sweetalert2';
import EditIcon from "@mui/icons-material/Edit";
import EditOffTwoToneIcon from '@mui/icons-material/EditOffTwoTone';

import Navbar from "../components/navbar/Navbar";

export default function Final_store_inventory_report({ onSearch }) {
  const Custom_Progress = () => (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
    <div className="loader"></div>
    <div style={{ marginTop: 16, fontSize: 18, fontWeight: 'bold', color: '#3498db' }}>Loading Report...</div>
      <style jsx>{`
        .loader {
          border: 8px solid #f3f3f3;
          border-top: 8px solid #3498db;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
  const [distinctFinalInventoryReport, setdistinctFinalInventoryReport] = useState([]);
  const [distinctMatSummaryByStdPack, setdistinctMatSummaryByStdPack] = useState([]);

  const [selectedRecordMatItem, setSelectedRecordMatItem] = useState(null);

  const [isNavbarOpen, setIsNavbarOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen_MatSummaryByStdPack, setisModalOpen_MatSummaryByStdPack] = useState(false);

  const [filterModel, setFilterModel] = React.useState({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [''],
  });
  const [filterModel_MatSummaryByStdPack, setFilterModel_MatSummaryByStdPack] = React.useState({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [''],
  });

  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({});
  const [columnVisibilityModel_MatSummaryByStdPack, setColumnVisibilityModel_MatSummaryByStdPack] = React.useState({});

  const handleNavbarToggle = (openStatus) => {
    setIsNavbarOpen(openStatus);
  };

  const handleCellTotalPackClick = (params) => {
    const TotalPackValue = parseInt(params.row.count_pack, 10);
    if (params.field === 'count_pack' && TotalPackValue > 0) {
      setSelectedRecordMatItem(params.row.mat_item);
      openModal_MatSummaryByStdPack()
    }
  };

  const fetchFinalInventoryReport = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://10.17.66.242:3001/api/smart_sus/filter-final-inventory-report-datagrid`);
      const data  = response.data;
      const rowsWithId = data.map((row, index) => ({
        ...row,
        id: index, 
      }));
      setdistinctFinalInventoryReport(rowsWithId);
    } catch (error) {
      console.error(`Error fetching distinct data SUS Delivery order: ${error}`);
    } finally {
      setIsLoading(false); 
    }
  };

  const fetchMatSummaryByStdPack = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://10.17.66.242:3001/api/smart_sus/filter-mat-summary-by-std-pack?mat_item=${selectedRecordMatItem}`);
      const data  = response.data;
      const rowsWithId = data.map((row, index) => ({
        ...row,
        id: index, 
      }));
      setdistinctMatSummaryByStdPack(rowsWithId);
    } catch (error) {
      console.error(`Error fetching distinct data SUS Delivery order: ${error}`);
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    fetchFinalInventoryReport();
    if (selectedRecordMatItem) {
      fetchMatSummaryByStdPack();
    }
  }, [selectedRecordMatItem]);

  const openModal_MatSummaryByStdPack = () => {
    setisModalOpen_MatSummaryByStdPack(true);
  };
  const closeModal_MatSummaryByStdPack = () => {
    setisModalOpen_MatSummaryByStdPack(false);
  };

  const style_Modal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // width: 400,
    // bgcolor: "white",
    boxShadow: 24,
    p: 2,
  };

  const columns_FinalInventoryReport = [
    { field: 'factory', headerName: 'Factory', width: 65 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center' },
    { field: 'loc_code', headerName: 'Location', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'mat_item', headerName: 'MAT Item', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left' },
    { field: 'mat_name', headerName: 'Description', width: 350 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'vd_name', headerName: 'Vendor name', width: 250 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'buyer_name', headerName: 'Buyer Name', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'count_pack', headerName: 'Total Packing', width: 135 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center' ,
      valueFormatter: (params) => {
        if (params.value == null) {
          return '';
        }
        const value = parseInt(params.value, 10);
        return isNaN(value) ? '' : value.toLocaleString();
      },
      renderCell: (params) => {
        const value = parseInt(params.value, 10);
        const style = {
          cursor: value > 0 ? 'pointer' : 'default',
          color: value > 0 ? 'blue' : 'inherit',
          textDecoration: value > 0 ? 'underline double' : 'inherit',
          fontWeight: value > 0 ? 'bold' : 'inherit',
        };

        return (
          <div style={style}>
            {isNaN(value) ? '0' : value.toLocaleString()}
          </div>
        );
      },
    },
    { field: 'sum_total', headerName: 'Total Qty. (pcs)', width: 135 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'right' ,
      valueFormatter: (params) => {
        if (params.value == null) {
          return '';
        }
        const value = parseInt(params.value, 10);
        return isNaN(value) ? '' : value.toLocaleString();
      },
      renderCell: (params) => {
        const value = parseInt(params.value, 10);
        const style = {
          cursor: value > 0 ? 'pointer' : 'default',
          color: value > 0 ? 'blue' : 'inherit',
          textDecoration: value > 0 ? 'underline double' : 'inherit',
          fontWeight: value > 0 ? 'bold' : 'inherit',
        };

        return (
          <div style={style}>
            {isNaN(value) ? '0' : value.toLocaleString()}
          </div>
        );
      },
    },
    { field: 'sum_good', headerName: 'Total Good (pcs)', width: 135 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'right' ,
      valueFormatter: (params) => {
        if (params.value == null) {
          return '';
        }
        const value = parseInt(params.value, 10);
        return isNaN(value) ? '' : value.toLocaleString();
      },
      renderCell: (params) => {
        const value = parseInt(params.value, 10);
        const style = {
          cursor: value > 0 ? 'pointer' : 'default',
          color: value > 0 ? 'blue' : 'inherit',
          textDecoration: value > 0 ? 'underline double' : 'inherit',
          fontWeight: value > 0 ? 'bold' : 'inherit',
        };

        return (
          <div style={style}>
            {isNaN(value) ? '0' : value.toLocaleString()}
          </div>
        );
      },
    },
    { field: 'sum_expired', headerName: 'Total Expired (pcs)', width: 135 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'right' ,
      valueFormatter: (params) => {
        if (params.value == null) {
          return '';
        }
        const value = parseInt(params.value, 10);
        return isNaN(value) ? '' : value.toLocaleString();
      },
      renderCell: (params) => {
        const value = parseInt(params.value, 10);
        const style = {
          cursor: value > 0 ? 'pointer' : 'default',
          color: value > 0 ? 'blue' : 'inherit',
          textDecoration: value > 0 ? 'underline double' : 'inherit',
          fontWeight: value > 0 ? 'bold' : 'inherit',
        };

        return (
          <div style={style}>
            {isNaN(value) ? '0' : value.toLocaleString()}
          </div>
        );
      },
    },
  ];

  const columns_MatSummaryByStdPack= [
    { field: 'loc_code', headerName: 'Location', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'mat_item', headerName: 'MAT Item', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left' },
    { field: 'mat_name', headerName: 'Description', width: 350 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'std_pack', headerName: 'Std. Pack', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'right',
      valueFormatter: (params) => {
        if (params.value == null) {
          return '';
        }
        const value = parseInt(params.value, 10);
        return isNaN(value) ? '' : value.toLocaleString();
      },
    },
    { field: 'total_pack', headerName: 'Total Packing', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'right',
      valueFormatter: (params) => {
        if (params.value == null) {
          return '';
        }
        const value = parseInt(params.value, 10);
        return isNaN(value) ? '' : value.toLocaleString();
      },
    },
    { field: 'total_qty', headerName: 'Total Qty. (pcs)', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'right',
      valueFormatter: (params) => {
        if (params.value == null) {
          return '';
        }
        const value = parseInt(params.value, 10);
        return isNaN(value) ? '' : value.toLocaleString();
      },
    },
    { field: 'sum_good', headerName: 'Good (pcs)', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'right',
      valueFormatter: (params) => {
        if (params.value == null) {
          return '';
        }
        const value = parseInt(params.value, 10);
        return isNaN(value) ? '' : value.toLocaleString();
      },
    },
    { field: 'sum_expired', headerName: 'Expired (pcs)', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'right',
      valueFormatter: (params) => {
        if (params.value == null) {
          return '';
        }
        const value = parseInt(params.value, 10);
        return isNaN(value) ? '' : value.toLocaleString();
      },
    },
  ]

  
  return (
    <>
      <GlobalStyles
        styles={{
          body: { overflow: 'hidden' },
          html: { overflow: 'hidden' },
        }}
      />
      <Navbar onToggle={handleNavbarToggle}/>
      <Box marginLeft={isNavbarOpen ? "220px" : 4} marginTop={10}>
        <Box sx={{height: 800 , marginTop: '30px' , marginLeft: '60px'}}>
          <div  style={{backgroundColor:'#DFF5FF' , height: 570 , width: 1575}}>
            {isLoading ? (
              <Custom_Progress />
            ) : (
              <DataGrid
                columns={columns_FinalInventoryReport}
                rows={distinctFinalInventoryReport}
                slots={{ toolbar: GridToolbar }}
                filterModel={filterModel}
                onFilterModelChange={(newModel) => setFilterModel(newModel)}
                slotProps={{ toolbar: { showQuickFilter: true } }}
                columnVisibilityModel={columnVisibilityModel}
                getRowHeight={() => 35} // Set the desired row height here
                // checkboxSelection
                onColumnVisibilityModelChange={(newModel) =>
                  setColumnVisibilityModel(newModel)
                }
                sx={{
                  '& .MuiDataGrid-row': {
                    backgroundColor: 'lightyellow', // Change to desired color
                  },
                  
                }}
                onCellClick={(event) => { 
                  handleCellTotalPackClick(event); 
                }} 
              />
            )}
          </div>
        </Box>
        {isModalOpen_MatSummaryByStdPack && (
          <Modal
            open={isModalOpen_MatSummaryByStdPack}
            onClose={closeModal_MatSummaryByStdPack}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
          >
            <Box
              sx={{
                ...style_Modal,
                width: 1210,
                height: 700,
                backgroundColor: "#CAF4FF",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "20px",
                    marginBottom: "10px",
                  }}
                >
                  <label htmlFor="" style={{ fontSize: '27px' , color: 'blue' , textDecoration: 'underline' , marginLeft: 10 }}>
                     Material summary  by Standard Packing
                  </label>
                  <label htmlFor="" style={{ fontSize: '27px' , marginLeft: 10 , color: '#FA7070'}}>
                        : {selectedRecordMatItem}
                  </label>
                </div>
                <div>
                  <IconButton onClick={closeModal_MatSummaryByStdPack}>
                    <CloseIcon style={{backgroundColor: '#FF7D29'}}/>
                  </IconButton>
                </div>
              </div>
              <div style={{ height: 620 , width: "100%" , backgroundColor: '#DFF5FF' }}>
                {isLoading ? (
                    <Custom_Progress />
                ) : (
                  <>
                    <DataGrid
                      columns={columns_MatSummaryByStdPack}
                      rows={distinctMatSummaryByStdPack}
                      slots={{ toolbar: GridToolbar }}
                      filterModel={filterModel_MatSummaryByStdPack}
                      onFilterModelChange={(newModel) => setFilterModel_MatSummaryByStdPack(newModel)}
                      slotProps={{ toolbar: { showQuickFilter: true } }}
                      columnVisibilityModel={columnVisibilityModel_MatSummaryByStdPack}
                      onColumnVisibilityModelChange={(newModel) =>
                        setColumnVisibilityModel_MatSummaryByStdPack(newModel)
                      }
                      getRowHeight={() => 35} // Set the desired row height here
                      sx={{
                        '& .MuiDataGrid-row': {
                          backgroundColor: '#F6F5F5', // Change to desired color
                        },
                      }}
                    />
                  </>
                )}
              </div>
            </Box>
          </Modal>
        )}
      </Box>
    </>
  );
}
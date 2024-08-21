import React, { useState, useEffect , useRef } from "react";
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import './styles/Final_store_inventory_report.css'; // Import the CSS file
import axios from "axios";
import { GlobalStyles } from '@mui/material';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Search_Final_store_inventory_report from "../components/Search_Comp/Search_Final_store_inventory_report";

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
  const [distinctMatSummaryDetail, setdistinctMatSummaryDetail] = useState([]);
  const [distinctMatSummaryDetailGood, setdistinctMatSummaryDetailGood] = useState([]);
  const [distinctMatSummaryDetailExpired, setdistinctMatSummaryDetailExpired] = useState([]);


  const [selectedFactory, setSelectedFactory] = useState(null);
  const [selectedMatItem, setSelectedMatItem] = useState(null);
  const [selectedLocCode, setSelectedLocCode] = useState(null);
  const [selectedRecordMatItem, setSelectedRecordMatItem] = useState(null);
  const [selectedRecordTotalPack, setSelectedRecordTotalPack] = useState(null);
  const [selectedRecordTotalQty, setSelectedRecordTotalQty] = useState(null);
  const [selectedRecordTotalGood, setSelectedRecordTotalGood] = useState(null);
  const [selectedRecordTotalExpired, setSelectedRecordTotalExpired] = useState(null);

  const [isNavbarOpen, setIsNavbarOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen_MatSummaryByStdPack, setisModalOpen_MatSummaryByStdPack] = useState(false);
  const [isModalOpen_MatSummaryDetail, setisModalOpen_MatSummaryDetail] = useState(false);
  const [isModalOpen_MatSummaryDetailGood, setisModalOpen_MatSummaryDetailGood] = useState(false);
  const [isModalOpen_MatSummaryDetailExpired, setisModalOpen_MatSummaryDetailExpired] = useState(false);


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
  const [filterModel_MatSummaryDetail, setFilterModel_MatSummaryDetail] = React.useState({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [''],
  });
  const [filterModel_MatSummaryDetailGood, setFilterModel_MatSummaryDetailGood] = React.useState({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [''],
  });
  const [filterModel_MatSummaryDetailExpired, setFilterModel_MatSummaryDetailExpired] = React.useState({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [''],
  });

  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({});
  const [columnVisibilityModel_MatSummaryByStdPack, setColumnVisibilityModel_MatSummaryByStdPack] = React.useState({});
  const [columnVisibilityModel_MatSummaryDetail, setColumnVisibilityModel_MatSummaryDetail] = React.useState({});
  const [columnVisibilityModel_MatSummaryDetailGood, setColumnVisibilityModel_MatSummaryDetailGood] = React.useState({});
  const [columnVisibilityModel_MatSummaryDetailExpired, setColumnVisibilityModel_MatSummaryDetailExpired] = React.useState({});

  const handleNavbarToggle = (openStatus) => {
    setIsNavbarOpen(openStatus);
  };

  const handleCellTotalPackClick = (params) => {
    const TotalPackValue = parseInt(params.row.count_pack, 10);
    if (params.field === 'count_pack' && TotalPackValue > 0) {
      setSelectedRecordMatItem(params.row.mat_item);
      setSelectedRecordTotalPack(params.row.count_pack.toLocaleString());
      openModal_MatSummaryByStdPack()
    }
  };

  const handleCellTotalQtyClick = (params) => {
    const TotalQtyValue = parseInt(params.row.sum_total, 10);
    if (params.field === 'sum_total' && TotalQtyValue > 0) {
      setSelectedRecordMatItem(params.row.mat_item);
      setSelectedRecordTotalQty(params.row.sum_total.toLocaleString());
      openModal_MatSummaryDetail()
    }
  };

  const handleCellTotalGoodClick = (params) => {
    const TotalGoodValue = parseInt(params.row.sum_good, 10);
    if (params.field === 'sum_good' && TotalGoodValue > 0) {
      setSelectedRecordMatItem(params.row.mat_item);
      setSelectedRecordTotalGood(params.row.sum_good.toLocaleString());
      openModal_MatSummaryDetailGood()
    }
  };

  const handleCellTotalExpiredClick = (params) => {
    const TotalExpiredValue = parseInt(params.row.sum_expired, 10);
    if (params.field === 'sum_expired' && TotalExpiredValue > 0) {
      setSelectedRecordMatItem(params.row.mat_item);
      setSelectedRecordTotalExpired(params.row.sum_expired.toLocaleString());
      openModal_MatSummaryDetailExpired()
    }
  };

  const fetchFinalInventoryReport = async () => {
    try {
      setIsLoading(true);
      let factory_selected = '';
      if (selectedFactory) {
          factory_selected = selectedFactory;
      } else {
          factory_selected = 'All'
      }
      console.log('factory_selected' , factory_selected);
      

      let loc_selected = '';
      if (selectedLocCode) {
          loc_selected = selectedLocCode;
      } else {
          loc_selected = 'All'
      }
      console.log('loc_selected' , loc_selected);

      let mat_selected = '';
      if (selectedMatItem) {
          mat_selected = selectedMatItem;
      } else {
          mat_selected = 'All'
      }
      console.log('mat_selected' , mat_selected);

      const response = await axios.get(`http://10.17.66.242:3001/api/smart_sus/filter-final-inventory-report-datagrid?factory=${factory_selected}&loc_code=${loc_selected}&mat_item=${mat_selected}`);
      const data  = response.data;
      const rowsWithId = data.map((row, index) => ({
        ...row,
        id: index, 
      }));
      setdistinctFinalInventoryReport(rowsWithId);
    } catch (error) {
      console.error(`Error fetching distinct data Final inventry: ${error}`);
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

  const fetchMatSummaryDetail = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://10.17.66.242:3001/api/smart_sus/filter-mat-summary-detail?mat_item=${selectedRecordMatItem}`);
      const data  = response.data;
      const rowsWithId = data.map((row, index) => ({
        ...row,
        id: index, 
      }));
      setdistinctMatSummaryDetail(rowsWithId);
    } catch (error) {
      console.error(`Error fetching distinct data SUS Delivery order: ${error}`);
    } finally {
      setIsLoading(false); 
    }
  };

  const fetchMatSummaryDetailGood = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://10.17.66.242:3001/api/smart_sus/filter-mat-summary-detail-good?mat_item=${selectedRecordMatItem}`);
      const data  = response.data;
      const rowsWithId = data.map((row, index) => ({
        ...row,
        id: index, 
      }));
      setdistinctMatSummaryDetailGood(rowsWithId);
    } catch (error) {
      console.error(`Error fetching distinct data SUS Delivery order: ${error}`);
    } finally {
      setIsLoading(false); 
    }
  };

  const fetchMatSummaryDetailExpired = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://10.17.66.242:3001/api/smart_sus/filter-mat-summary-detail-expired?mat_item=${selectedRecordMatItem}`);
      const data  = response.data;
      const rowsWithId = data.map((row, index) => ({
        ...row,
        id: index, 
      }));
      setdistinctMatSummaryDetailExpired(rowsWithId);
    } catch (error) {
      console.error(`Error fetching distinct data SUS Delivery order: ${error}`);
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    if (selectedFactory && selectedLocCode && selectedMatItem) {
      fetchFinalInventoryReport();
    }
    // fetchFinalInventoryReport();
    if (selectedRecordMatItem) {
      fetchMatSummaryByStdPack();
      fetchMatSummaryDetail();
      fetchMatSummaryDetailGood();
      fetchMatSummaryDetailExpired();
    }
  }, [selectedFactory, selectedLocCode, selectedMatItem, selectedRecordMatItem]);

  const openModal_MatSummaryByStdPack = () => {
    setisModalOpen_MatSummaryByStdPack(true);
  };
  const closeModal_MatSummaryByStdPack = () => {
    setisModalOpen_MatSummaryByStdPack(false);
    setSelectedRecordMatItem(null);
  };

  const openModal_MatSummaryDetail = () => {
    setisModalOpen_MatSummaryDetail(true);
  };
  const closeModal_MatSummaryDetail = () => {
    setisModalOpen_MatSummaryDetail(false);
    setSelectedRecordMatItem(null);
  };

  const openModal_MatSummaryDetailGood = () => {
    setisModalOpen_MatSummaryDetailGood(true);
  };
  const closeModal_MatSummaryDetailGood = () => {
    setisModalOpen_MatSummaryDetailGood(false);
    setSelectedRecordMatItem(null);
  };

  const openModal_MatSummaryDetailExpired = () => {
    setisModalOpen_MatSummaryDetailExpired(true);
  };
  const closeModal_MatSummaryDetailExpired = () => {
    setisModalOpen_MatSummaryDetailExpired(false);
    setSelectedRecordMatItem(null);
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

  const columns_MatSummaryDetail= [
    { field: 'loc_code', headerName: 'Location', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'mat_item', headerName: 'MAT Item', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center' },
    { field: 'mat_name', headerName: 'Description', width: 350 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'bar_code', headerName: 'Barcode', width: 150 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'supp_name', headerName: 'Supplier', width: 200 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'invoice', headerName: 'Invoice', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'mat_qty', headerName: 'Qty. (pcs)', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'right',
      valueFormatter: (params) => {
        if (params.value == null) {
          return '';
        }
        const value = parseInt(params.value, 10);
        return isNaN(value) ? '' : value.toLocaleString();
      },
    },
    { field: 'rec_date', headerName: 'Receive Date', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'exp_date', headerName: 'Expired Date', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'exp_status', headerName: 'Status', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center' ,
      renderCell: (params) => {
        let backgroundColor = '';
        switch (params.value) {
          case 'Good':
            backgroundColor = 'lightgreen';
            break;
          case 'Expired':
            backgroundColor = 'red';
            break;
          default:
            break;
        }
        return (
          <div style={{ backgroundColor: backgroundColor, width: '100%', height: '100%', textAlign: 'center' , paddingTop: 5}}>
            {params.value}
          </div>
        );
      }
    },
  ]

  const columns_MatSummaryDetailGood= [
    { field: 'loc_code', headerName: 'Location', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'mat_item', headerName: 'MAT Item', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center' },
    { field: 'mat_name', headerName: 'Description', width: 350 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'bar_code', headerName: 'Barcode', width: 150 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'supp_name', headerName: 'Supplier', width: 200 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'invoice', headerName: 'Invoice', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'mat_qty', headerName: 'Qty. (pcs)', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'right',
      valueFormatter: (params) => {
        if (params.value == null) {
          return '';
        }
        const value = parseInt(params.value, 10);
        return isNaN(value) ? '' : value.toLocaleString();
      },
    },
    { field: 'rec_date', headerName: 'Receive Date', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'exp_date', headerName: 'Expired Date', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'exp_status', headerName: 'Status', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center' ,
      renderCell: (params) => {
        let backgroundColor = '';
        switch (params.value) {
          case 'Good':
            backgroundColor = 'lightgreen';
            break;
          case 'Expired':
            backgroundColor = 'red';
            break;
          default:
            break;
        }
        return (
          <div style={{ backgroundColor: backgroundColor, width: '100%', height: '100%', textAlign: 'center' , paddingTop: 5}}>
            {params.value}
          </div>
        );
      }
    },
  ]

  const columns_MatSummaryDetailExpired= [
    { field: 'loc_code', headerName: 'Location', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'mat_item', headerName: 'MAT Item', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center' },
    { field: 'mat_name', headerName: 'Description', width: 350 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'bar_code', headerName: 'Barcode', width: 150 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'supp_name', headerName: 'Supplier', width: 200 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'invoice', headerName: 'Invoice', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'mat_qty', headerName: 'Qty. (pcs)', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'right',
      valueFormatter: (params) => {
        if (params.value == null) {
          return '';
        }
        const value = parseInt(params.value, 10);
        return isNaN(value) ? '' : value.toLocaleString();
      },
    },
    { field: 'rec_date', headerName: 'Receive Date', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'exp_date', headerName: 'Expired Date', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'exp_status', headerName: 'Status', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center' ,
      renderCell: (params) => {
        let backgroundColor = '';
        switch (params.value) {
          case 'Good':
            backgroundColor = 'lightgreen';
            break;
          case 'Expired':
            backgroundColor = 'red';
            break;
          default:
            break;
        }
        return (
          <div style={{ backgroundColor: backgroundColor, width: '100%', height: '100%', textAlign: 'center' , paddingTop: 5}}>
            {params.value}
          </div>
        );
      }
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
          <Search_Final_store_inventory_report
              onSearch={(queryParams) => {
                setSelectedFactory(queryParams.factory);
                setSelectedMatItem(queryParams.MatItem);
                setSelectedLocCode(queryParams.Location);
              }}
          />
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
                  handleCellTotalQtyClick(event);
                  handleCellTotalGoodClick(event);
                  handleCellTotalExpiredClick(event);
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
                  <label htmlFor="" style={{ fontSize: '27px' , marginLeft: 10 , color: '#FA7070'}}>
                        ({selectedRecordTotalPack} Pack)
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
        {isModalOpen_MatSummaryDetail && (
          <Modal
            open={isModalOpen_MatSummaryDetail}
            onClose={closeModal_MatSummaryDetail}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
          >
            <Box
              sx={{
                ...style_Modal,
                width: 1560,
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
                     Material summary  details
                  </label>
                  <label htmlFor="" style={{ fontSize: '27px' , marginLeft: 10 , color: '#FA7070'}}>
                        : {selectedRecordMatItem}
                  </label>
                  <label htmlFor="" style={{ fontSize: '27px' , marginLeft: 10 , color: '#FA7070'}}>
                        ({selectedRecordTotalQty} Pcs.)
                  </label>
                </div>
                <div>
                  <IconButton onClick={closeModal_MatSummaryDetail}>
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
                      columns={columns_MatSummaryDetail}
                      rows={distinctMatSummaryDetail}
                      slots={{ toolbar: GridToolbar }}
                      filterModel={filterModel_MatSummaryDetail}
                      onFilterModelChange={(newModel) => setFilterModel_MatSummaryDetail(newModel)}
                      slotProps={{ toolbar: { showQuickFilter: true } }}
                      columnVisibilityModel={columnVisibilityModel_MatSummaryDetail}
                      onColumnVisibilityModelChange={(newModel) =>
                        setColumnVisibilityModel_MatSummaryDetail(newModel)
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
        {isModalOpen_MatSummaryDetailGood && (
          <Modal
            open={isModalOpen_MatSummaryDetailGood}
            onClose={closeModal_MatSummaryDetailGood}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
          >
            <Box
              sx={{
                ...style_Modal,
                width: 1560,
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
                     Material summary  details (Good)
                  </label>
                  <label htmlFor="" style={{ fontSize: '27px' , marginLeft: 10 , color: '#FA7070'}}>
                        : {selectedRecordMatItem}
                  </label>
                  <label htmlFor="" style={{ fontSize: '27px' , marginLeft: 10 , color: '#FA7070'}}>
                        ({selectedRecordTotalGood} Pcs.)
                  </label>
                </div>
                <div>
                  <IconButton onClick={closeModal_MatSummaryDetailGood}>
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
                      columns={columns_MatSummaryDetailGood}
                      rows={distinctMatSummaryDetailGood}
                      slots={{ toolbar: GridToolbar }}
                      filterModel={filterModel_MatSummaryDetailGood}
                      onFilterModelChange={(newModel) => setFilterModel_MatSummaryDetailGood(newModel)}
                      slotProps={{ toolbar: { showQuickFilter: true } }}
                      columnVisibilityModel={columnVisibilityModel_MatSummaryDetailGood}
                      onColumnVisibilityModelChange={(newModel) =>
                        setColumnVisibilityModel_MatSummaryDetailGood(newModel)
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
        {isModalOpen_MatSummaryDetailExpired && (
          <Modal
            open={isModalOpen_MatSummaryDetailExpired}
            onClose={closeModal_MatSummaryDetailExpired}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
          >
            <Box
              sx={{
                ...style_Modal,
                width: 1560,
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
                     Material summary  details (Expired)
                  </label>
                  <label htmlFor="" style={{ fontSize: '27px' , marginLeft: 10 , color: '#FA7070'}}>
                        : {selectedRecordMatItem}
                  </label>
                  <label htmlFor="" style={{ fontSize: '27px' , marginLeft: 10 , color: '#FA7070'}}>
                        ({selectedRecordTotalExpired} Pcs.)
                  </label>
                </div>
                <div>
                  <IconButton onClick={closeModal_MatSummaryDetailExpired}>
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
                      columns={columns_MatSummaryDetailExpired}
                      rows={distinctMatSummaryDetailExpired}
                      slots={{ toolbar: GridToolbar }}
                      filterModel={filterModel_MatSummaryDetailExpired}
                      onFilterModelChange={(newModel) => setFilterModel_MatSummaryDetailExpired(newModel)}
                      slotProps={{ toolbar: { showQuickFilter: true } }}
                      columnVisibilityModel={columnVisibilityModel_MatSummaryDetailExpired}
                      onColumnVisibilityModelChange={(newModel) =>
                        setColumnVisibilityModel_MatSummaryDetailExpired(newModel)
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
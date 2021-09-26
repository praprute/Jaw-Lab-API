const express = require('express');
const router = express.Router();

const {
	addOrder,
	updateOrder,
	deleteOrder,
	readAllOrder,
	readOrderById,
	readAllSpecificChem,
	addSpecificChem,
	updateSpecificChem,
	readAllSpecificChemById,
	DeleteSpecificChemById,
	readRecheckOrder,
	readRealTimeOrder,
	readTestReportlasted,
	readAllSpecificBioById,
	Addtestreport,
	readAllSpecificMicro,
	readIdChem,
	readIdMicro,
	urgentOrders,
	readOrdertoCheck,
	reSend,
	Recheck,
	WaitMicro,
	readFG,
	updateFG,
	readST,
	updateSTadST,
	addRealTimeOrder,
	updateCardDS,
	readCardDS,
	exportCOA,
	UpdatexportCOA,
	UpdatexportPASS,
	PassToCheck,
	CustomersName,
	loadHalalLogo,
	UpdateStatusReprocess,
	UpdateDatailOrder,
	queryDetailMulti,
	dailyReport,
	dailyReportBio,
} = require('../controller/ProductConotroller');

// const status = {
//     1: (
//       <span className="badge bg-success font-size-10">Completed</span>
//     ),
//     0: <span className="badge bg-warning font-size-10">Waiting to check</span>,
//     3: <span className="badge bg-warning font-size-10">Waiting to Micro</span>,
//     2: <span className="badge bg-danger font-size-10">Rechecking</span>,
//   }

// const statePriority = {
//     0: <span className="badge bg-success font-size-10">normal</span>,
//     1: <span className="badge bg-warning font-size-10">rush</span>,
//     2: <span className="badge bg-danger font-size-10">urgent</span>,
//     }


const { requireSignin } = require('../controller/authController')
router.post('/addOrder', requireSignin,addOrder);
router.post('/updateOrder', requireSignin,updateOrder);
router.post('/deleteOrder', requireSignin,deleteOrder);

router.post('/readAllOrder', requireSignin,readAllOrder);
router.post('/readOrdertoCheck', requireSignin,readOrdertoCheck);
router.post('/urgentOrders', requireSignin,urgentOrders);

router.post('/readOrderById', requireSignin,readOrderById);
router.post('/readAllSpecificChem', requireSignin,readAllSpecificChem);
router.post('/readAllSpecificMicro', requireSignin,readAllSpecificMicro);
router.post('/addSpecificChem', requireSignin,addSpecificChem);
router.post('/updateSpecificChem', requireSignin,updateSpecificChem);
router.post('/readAllSpecificChemById', requireSignin,readAllSpecificChemById);
router.post('/DeleteSpecificChemById', requireSignin,DeleteSpecificChemById);
router.post('/readRecheckOrder', requireSignin,readRecheckOrder);
router.post('/readAllSpecificBioById', requireSignin,readAllSpecificBioById);

//Card Dashboard
router.post('/updateCardDS', requireSignin,updateCardDS);
router.post('/readCardDS', requireSignin,readCardDS);

//real time order
router.post('/addRealTimeOrder', requireSignin,addRealTimeOrder);
router.post('/readRealTimeOrder', requireSignin,readRealTimeOrder);
router.post('/dailyReport', requireSignin, dailyReport);
router.post('/dailyReportBio', requireSignin, dailyReportBio);

// dailyReportBio
//Read Chart FG ST
router.post('/readFG', requireSignin,readFG);
router.post('/updateFGadFG', requireSignin,updateFG);
router.post('/readST', requireSignin,readST);
router.post('/updateSTadST', requireSignin,updateSTadST);

//Read test report
router.post('/readTestReportlasted', requireSignin,readTestReportlasted);

//Addtestreport
router.post('/Addtestreport', requireSignin,Addtestreport);

//Recheck
router.post('/Recheck', requireSignin,Recheck);
router.post('/reSend', requireSignin,reSend);

//wait micro
router.post('/WaitMicro', requireSignin,WaitMicro);

//Checkbox Specific
router.post('/readIdChemCheckbox', requireSignin,readIdChem);
router.post('/readIdMicroCheckbox', requireSignin,readIdMicro);

//Update Statuses
router.post('/UpdateStatus/PassToCheck', requireSignin,PassToCheck);
// router.post('/UpdateStatus/PassOrder', requireSignin,UpdatexportPASS);

//Upload Logo
router.post('/exportCOA', requireSignin,exportCOA);
router.post('/loadHalalLogo', requireSignin,loadHalalLogo);

//exportCOA
router.post('/UpdatexportCOA', requireSignin,UpdatexportCOA);
router.post('/UpdatexportPASS', requireSignin,UpdatexportPASS);

//UpdateDatailOrder
router.post('/UpdateDatailOrder', requireSignin, UpdateDatailOrder);


//Reprocess 
router.post('/Reprocess', requireSignin, UpdateStatusReprocess);

//queryDetailMulti
router.post('/queryDetailMulti', requireSignin, queryDetailMulti);


//Get Customers
router.get('/getCustomers' , requireSignin,CustomersName);
module.exports = router;



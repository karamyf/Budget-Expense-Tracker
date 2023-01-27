import React, { useState, useEffect } from "react";
import { Form, Input, message, Modal, Select, Table, DatePicker } from "antd";
import {
  UnorderedListOutlined,
  AreaChartOutlined,
  EditOutlined,
  DeleteOutlined,
  StarOutlined,
} from "@ant-design/icons";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import Spinner from "./../components/Spinner";
import moment from "moment";
import Analytics from "../components/Analytics";
const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransaction, setAllTransaction] = useState([]);
  const [frequency, setFrequency] = useState("365");
  const [selectedDate, setSelectedate] = useState([]);
  const [type, setType] = useState("all");
  const [viewData, setViewData] = useState("table");
  const [editable, setEditable] = useState(null);

  //table data
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Actions",
      key: "action",
      className: "actions",
      render: (text, record) => (
        <div>
          <EditOutlined
            className="btn-black"
            onClick={() => {
              setEditable(record);
              setShowModal(true);
            }}
          />
          <DeleteOutlined
            className="btn-black"
            onClick={() => {
              if (window.confirm("Are you sure you want to delete?")) {
                handleDelete(record);
              }
            }}
          />
          <StarOutlined
            className="btn-black"
            onClick={() => {
              handleAddToFavorites(record);
            }}
          />
        </div>
      ),
    },
  ];



  const refresh = () => window.location.reload(true)

  //getall transactions

  //useEffect Hook
  useEffect(() => {
    const getAllTransactions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        setLoading(true);
        const res = await axios.post("/transections/get-transection", {
          userid: user._id,
          frequency,
          selectedDate,
          type,
        });
        setLoading(false);
        setAllTransaction(res.data);
        console.log(res.data);
      } catch (error) {

        console.log(error);
        message.error("There is an issue with the Transaction");
      }
    };
    getAllTransactions();
  }, [frequency, selectedDate, type]);

// VIEWING DATA OF FAVORITES

/*
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
      const getFavorites = async () => {
        try {
          const user = JSON.parse(localStorage.getItem("user"));
          setLoading(true);
          const res = await axios.post("/transection/get-favorites", {
            userid: user._id,
          });
          setLoading(false);
          setFavorites(res.data);
          console.log(res.data);
        } catch (error) {
          console.log(error);
          message.error("There is an issue with getting the favorites");
        }
      };
      getFavorites();
    }, []);
  */

  const handleAddToFavorites = async (record) => {
    try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("user"));
        await axios.post("/transections/add-to-favorites", {

          userId: user._id,
          transactionId: record._id
        });
        setLoading(false);
        message.success("Transaction added to favorites!");
    } catch (error) {
        setLoading(false);
        message.error("There was an error adding the transaction to favorites. Please try again later.");
    }
};




  //search bar handler
  const filterContent = (allTransaction, searchTerm) => {
    const result = allTransaction.filter(
      (transection) =>
        transection.description.toLowerCase().includes(searchTerm)
    );
    setAllTransaction(result);
  };


  const handleTextSearch = async (e) => {
    console.log(e.currentTarget.value);
    const searchTerm = e.currentTarget.value.toLowerCase();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      const res = await axios.post("/transections/get-transection", {
        userid: user._id,
        frequency,
        selectedDate,
        type,
      });
      setLoading(false);
      setAllTransaction(res.data);
      filterContent(res.data, searchTerm);
    } catch (error) {
      console.log(error);
      message.error("There is an issue with the Transaction");
    }
  };



  //delete handler
  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.post("/transections/delete-transection", {
        transacationId: record._id,
      });
      setLoading(false);
      message.success("Transaction Deleted!");
      refresh();
    } catch (error) {
      refresh();
    }
  };
  //generating a random number for reference
  //const randomNumber = Math.floor(Math.random() * 1000) + 1;

  // form handling
  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      if (editable) {
        await axios.post("/transections/edit-transection", {
          payload: {
            ...values,
            userId: user._id,
          },
          transacationId: editable._id,
        });
        setLoading(false);
        message.success("Transaction Updated Successfully");
      } else {
        await axios.post("/transections/add-transection", {
          ...values,
          userid: user._id,
        });
        setLoading(false);
        message.success("Transaction Added Successfully");
      }
      setShowModal(false);
      setEditable(null);
      refresh();
    } catch (error) {
      setLoading(false);
      refresh();
    }
  };




  return (
    <Layout>
      {loading && <Spinner />}
      <div className="filters">
        <div>
          <h6>Date</h6>
          <Select value={frequency} onChange={(values) => setFrequency(values)}>
            <Select.Option value="7">LAST 1 Week</Select.Option>
            <Select.Option value="30">LAST 1 Month</Select.Option>
            <Select.Option value="365">LAST 1 Year</Select.Option>
            <Select.Option value="custom">CUSTOM</Select.Option>
          </Select>
          {frequency === "custom" && (
            <RangePicker
              value={selectedDate}
              onChange={(values) => setSelectedate(values)}
            />
          )}
        </div>
        <div>

          <h6>Transaction Type</h6>
          <Select value={type} onChange={(values) => setType(values)}>
            <Select.Option value="all">ALL</Select.Option>
            <Select.Option value="income">INCOME</Select.Option>
            <Select.Option value="expense">EXPENSE</Select.Option>
          </Select>
          {frequency === "custom" && (
            <RangePicker
              value={selectedDate}
              onChange={(values) => setSelectedate(values)}
            />
          )}
        </div>
        <div className="switch-icons">
          <div className="unorderedlist" onClick={() => setViewData("table")}>
            <UnorderedListOutlined
              className={`mx-2 ${viewData === "table" ? "active-icon" : "inactive-icon"}`}
              onClick={() => setViewData("table")}
            />
          </div>
          <div className="chart" onClick={() => setViewData("analytics")}>
            <AreaChartOutlined
              className={`mx-2 ${viewData === "analytics" ? "active-icon" : "inactive-icon"}`}
              onClick={() => setViewData("analytics")}
            />
          </div>

        </div>
        <div>
          <input
            className="form-control"
            type="search"
            placeholder="Search by description"
            name="searchTerm"
            onChange={handleTextSearch}
          ></input>
        </div>
        <div>

          <button
            className="btn-addnew"
            onClick={() => setShowModal(true)}
          >
            Add
          </button>
        </div>

      </div>
      <div className="content">
        {viewData === "table" ? (
          <Table columns={columns} dataSource={allTransaction} />
        ) : (
          <Analytics allTransaction={allTransaction} />
        )}
      </div>

      <Modal
        title={editable ? "Edit Transaction" : "Add Transaction"}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={false}
      >

        <Form
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item label="Amount" name="amount">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="type" name="type">
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Category" name="category">
            <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="tip">Tip</Select.Option>
              <Select.Option value="project">Project</Select.Option>
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="movie">Movie</Select.Option>
              <Select.Option value="bills">Bills</Select.Option>
              <Select.Option value="medical">Medical</Select.Option>
              <Select.Option value="fee">Fee</Select.Option>
              <Select.Option value="tax">TAX</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date" name="date">
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input type="text" />
          </Form.Item>

          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              {" "}
              SAVE
            </button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;

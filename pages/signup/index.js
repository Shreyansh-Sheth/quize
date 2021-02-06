import {
  Form,
  Input,
  Tooltip,
  Cascader,
  Select,
  Row,
  Col,
  Button,
  AutoComplete,
  DatePicker,
} from "antd";
const { Option } = AutoComplete;
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { auth } from "../../src/config/firebaseConfig";
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

const RegistrationForm = () => {
  const [result, setResult] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [bady, setBday] = useState("");
  const [form] = Form.useForm();
  const router = useRouter();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/");
      }
    });
  }, []);

  const handleSearch = (value) => {
    let res = [];

    if (!value || value.indexOf("@") >= 0) {
      res = [];
    } else {
      res = ["gmail.com", "yahoo.com", "outlook.com"].map(
        (domain) => `${value}@${domain}`
      );
    }
  };

  const CreateUser = async () => {
    try {
      const values = await form.validateFields();
    } catch {
      return;
    }
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(function (result) {
        result.user.sendEmailVerification();
        return result.user
          .updateProfile({
            displayName: username,
          })
          .then(() => {
            router.push("/");
          });
      })
      .catch(function (error) {});
  };
  return (
    <Form
      style={{
        marginTop: "70px",
        marginLeft: "500px",
        marginRight: "500px",
      }}
      {...formItemLayout}
      form={form}
      name="register"
      scrollToFirstError
      labelAlign="left"
    >
      <Form.Item
        label="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        rules={[
          {
            required: true,
            message: "Please input your Email!",
          },
        ]}
      >
        <AutoComplete onSearch={handleSearch} placeholder="Email">
          {result.map((email) => (
            <Option key={email} value={email}>
              {email}
            </Option>
          ))}
        </AutoComplete>
      </Form.Item>

      <Form.Item
        name="username"
        label="Username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
        rules={[
          {
            required: true,
            message: "Please Input Username",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        value={password}
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
        hasFeedback
      >
        <Input.Password
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Please confirm your password!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }

              return Promise.reject(
                "The two passwords that you entered do not match!"
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="Birth Date"
        rules={[
          {
            required: true,
            message: "Please add your birthday",
          },
        ]}
      >
        <DatePicker
          onChange={(e, x) => {
            setBday(x);
          }}
        />
      </Form.Item>
      <Button type="primary" onClick={CreateUser}>
        Signin
      </Button>
    </Form>
  );
};
export default RegistrationForm;

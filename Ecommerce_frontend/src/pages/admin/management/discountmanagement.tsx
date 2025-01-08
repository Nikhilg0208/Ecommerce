import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Skeleton } from "../../../components/loader";
import { useSingleCouponQuery } from "../../../redux/api/couponAPI";
import { RootState, server } from "../../../redux/store";
import { CustomError } from "../../../types/api-types";

const DiscountManagement = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) {
    return <div>Invalid coupon ID</div>;
  }
  
  const { isLoading, data, isError, error } = useSingleCouponQuery({
    id,
    userId: user?._id || "",
  });

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  const [code, setCode] = useState("");
  const [amount, setAmount] = useState(0);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    // submit handler
    e.preventDefault();

    setBtnLoading(true);

    try {
      const { data } = await axios.put(
        `${server}/api/v1/payment/coupon/${id}?id=${user?._id}`,
        {
          code,
          amount,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        setAmount(0);
        setCode("");
        toast.success(data.message);
        navigate("/admin/discount");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      setCode(data.coupon.code);
      setAmount(data.coupon.amount);
    }
  }, [data]);

  const deleteHandler = async () => {
    setBtnLoading(true);

    try {
      const { data } = await axios.delete(
        `${server}/api/v1/payment/coupon/${id}?id=${user?._id}`,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/admin/discount");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <Skeleton length={20} />
        ) : (
          <>
            <article>
              <button className="product-delete-btn" onClick={deleteHandler}>
                <FaTrash />
              </button>
              <form onSubmit={submitHandler}>
                <h2>Manage</h2>
                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>

                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                </div>

                <button disabled={btnLoading} type="submit">
                  Update
                </button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default DiscountManagement;

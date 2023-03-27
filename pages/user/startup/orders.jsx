import BackButton from "../../../components/BackButton";
import LoginHeader from "../../../components/LoginHeader";
import { Accordion, Panel } from "baseui/accordion";
import { Button, SIZE, SHAPE } from "baseui/button";

function orders() {

    var currentTheme
    currentTheme =  typeof window !== "undefined" ? JSON.parse(localStorage.getItem("theme")) : 1;

    const data = [
        {
            productName: "Product 1",
            productId: "1",
            orders: [{name: "Customer 1", pieces: "1", orderId: '1'}, {name: "Customer 2", pieces: "2", orderId: '2'}],
        },
        {
            productName: "Product 2",
            productId: "2",
            orders: [{name: "Customer 1", pieces: "1", orderId: '3'}, {name: "Customer 2", pieces: "2", orderId: '4'}],
        },
        {
            productName: "Product 3",
            productId: "3",
            orders: [{name: "Customer 1", pieces: "1", orderId: '5'}, {name: "Customer 2", pieces: "2", orderId: '6'}],
        }
    ]

    return (
        <>
            <LoginHeader/>
            <BackButton/>
            <h2 className="select-none my-[1rem] py-[1rem] text-3xl cursor-default text-center">Orders</h2>
            <div className="mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem] ">
                <Accordion accordion overrides={{ Header: { style: ({ $theme }) => ({ backgroundColor: currentTheme ? "#eeeeee" : "#292929" }) }, }} >{/* onChange={({ expanded }) => console.log(expanded)} */}
                    {data.map(product=>( 
                        <Panel title={product.productName} key={product.productId}>
                            {product.orders.map(order => (
                                <div key={order.orderId} className="flex gap-4 items-center mt-1 pt-1">
                                    <p>Name: {order.name}</p>
                                    <p>Pieces Ordered: {order.pieces}</p>
                                    <Button onClick={() => console.log(order.orderId)} size={SIZE.compact} shape={SHAPE.pill} > Parcel Ready </Button>
                                </div>))}
                        </Panel>))}
                </Accordion>
            </div>
        </>
    );
}

export default orders;
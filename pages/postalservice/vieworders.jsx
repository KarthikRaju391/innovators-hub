import BackButton from "../../components/BackButton";
import LoginHeader from "../../components/LoginHeader";
import { Button, SIZE } from "baseui/button";

function viewmanager() {

    var data = [
        {startupAddress: 'Bangalore', customerAddress: "Manglore", date: "27-02-2023", productName: "Hand Pump", startupPhone: "8489531221", customerPhone: "6362232130"},
        {startupAddress: 'Bangalore', customerAddress: "Tumkur", date: "27-01-2023", productName: "Books", startupPhone: "7654329843", customerPhone: "9844722941"},
        {startupAddress: 'Bangalore', customerAddress: "Hampi", date: "27-12-2022", productName: "Phone", startupPhone: "9596232453", customerPhone: "9038541752"},
        {startupAddress: 'Bangalore', customerAddress: "Bellari", date: "27-11-2022", productName: "Laptop", startupPhone: "8489531221", customerPhone: "6362232130"},
        {startupAddress: 'Bangalore', customerAddress: "Dharwad", date: "27-10-2022", productName: "Charger", startupPhone: "8489531221", customerPhone: "6362232130"},
    ]

    data?.sort((a, b) => {
        const dateA = new Date(a.date.split('-').reverse().join('-'));
        const dateB = new Date(b.date.split('-').reverse().join('-'));
        return dateA.getTime() - dateB.getTime();
      });

    var collected = (pro) =>{
        pro["collected"]=true
        console.log(pro)
    }

    var delivered = (pro) =>{
        pro["delivered"]=true
        console.log(pro)
    }

    var tblContent = data?.map((e,i)=>( <tr key={i} className={`row animate__animated animate__fadeInUp`}> <td className='col'>{e.startupAddress}</td> <td className='col'>{e.customerAddress}</td> <td className='col'>{e.date}</td> <td className='col'>{e.productName}</td> <td className='col'>{e.startupPhone}</td> <td className='col'>{e.customerPhone}</td> <td className='col'><Button onClick={() => collected(e)} size={SIZE.compact} >Collected</Button></td> <td className='col'><Button onClick={() => delivered(e)} size={SIZE.compact} >Delivered</Button></td> </tr> )) 

    return (
        <>
            <LoginHeader/>
            <BackButton/>
            <h2 className="select-none mt-[1rem] pt-[1rem] text-3xl cursor-default text-center">View Orders</h2>

            {data?.length > 0 ? (
          <div className='flex overflow-x-auto'>
          <table className='mx-auto mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]'>
            <thead>
              <tr className='animate__animated animate__fadeInUp'>
                <th>From</th>
                <th>To</th>
                <th>Date</th>
                <th>Product Name</th>
                <th>Startup Contact</th>
                <th>Customer Contact</th>
                <th>Collection</th>
                <th>Delivery</th>
              </tr>
            </thead>
            <tbody>
              {tblContent}
            </tbody>
          </table>
          </div>
        ) : <p className='mt-2 cursor-default text-center mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]'>No Orders Yet</p> }
        </>
    );
}

export default viewmanager;
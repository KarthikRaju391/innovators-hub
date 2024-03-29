import * as React from "react";
import Header from "../components/Header";
import SideNavUser from "../components/SideNav/SideNavUser";
import Link from "next/link";

function termsandconditions() {

    const [isOpen, setIsOpen] = React.useState(false);

    var handleOpen = () =>{
        setIsOpen(false)
    }

    return (
        <>
            <SideNavUser open={isOpen} handleOpen={handleOpen}/>
            <Header/>
            <p className="text-3xl mb-[2rem] text-center cursor-default">TERMS & CONDITIONS</p>
                <ol className="list-decimal mx-[6%] text-justify cursor-default mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]">
                    <li className="mb-[2rem]">
                        <p className="text-lg">Account Registration:</p>
                        <ul className="list-disc ml-[3%]">
                            <li className="mb-[1rem]">
                                Startups: If you are a startup, you may create an account to showcase and sell your products on our platform. You represent and warrant that all information provided during the registration process is accurate and complete.
                            </li>
                            <li className="mb-[1rem]">
                                Customers: To make purchases on our website, you may need to create a customer account. You are responsible for maintaining the confidentiality of your account information and accept responsibility for all activities that occur under your account.
                            </li>
                            <li className="mb-[1rem]">
                                Investors: Investors may create an account to access and invest in startup projects. You represent and warrant that you have the necessary legal capacity and authority to make investments.
                            </li>
                        </ul>
                    </li>
                    <li className="mb-[1rem]">
                        <p className="text-lg">Product Listings and Transactions:</p>
                        <ul className="list-disc ml-[3%]">
                            <li className="mb-[1rem]">
                                Startups: As a startup, you are responsible for providing accurate and up-to-date product information, including descriptions, prices, and availability. You acknowledge that the sales of your products are subject to acceptance by customers and our platform reserves the right to refuse or cancel any transaction.
                            </li>
                            <li className="mb-[1rem]">
                                Customers: By purchasing products from startups on our platform, you acknowledge that the transaction is between you and the startup. We do not guarantee the accuracy of product listings or the quality, safety, or legality of the products. Any issues or disputes should be resolved directly with the startup.
                            </li>
                            <li className="mb-[1rem]">
                                Investors: Our platform provides information about startup projects for investment purposes. However, we do not guarantee the success, profitability, or viability of any projects. Investments are made at the investor's own risk.
                            </li>
                        </ul>
                    </li>
                    <li className="mb-[1rem]">
                        <p className="text-lg">Pricing, Payment, and Refunds:</p>
                        <ul className="list-disc ml-[3%]">
                            <li className="mb-[1rem]">
                                Pricing: All prices are listed in "INDIAN RUPEES" and are subject to applicable taxes, fees, and shipping charges.
                            </li>
                            <li className="mb-[1rem]">
                                Payment: We accept various payment methods, as specified on our website. By providing payment information, you represent and warrant that you have the necessary rights to use the selected payment method.
                            </li>
                            <li className="mb-[1rem]">
                                Refunds: Refunds for product purchases or investments are subject to the refund policies of the respective startups. Please refer to the startup's refund policy for more details.
                            </li>
                        </ul>
                    </li>
                    <li className="mb-[1rem]">
                        <p className="text-lg">Intellectual Property:</p>
                        <ul className="list-disc ml-[3%]">
                            <li className="mb-[1rem]">
                                Startups: You retain all rights and ownership of your intellectual property related to the products listed on our platform. By listing your products, you grant us a non-exclusive, worldwide, royalty-free license to display and promote your products on our website.
                            </li>
                            <li className="mb-[1rem]">
                                Customers and Investors: You acknowledge that all intellectual property rights of the products or projects displayed on our website belong to the respective startups. You may not reproduce, distribute, modify, or create derivative works without the prior written consent of the startup.
                            </li>
                        </ul>
                    </li>
                    <li className="mb-[1rem]">
                        <p className="text-lg">Privacy and Data Protection:</p>
                        <ul className="list-disc ml-[3%]">
                            <li className="mb-[1rem]">
                                We value your privacy and handle your personal information in accordance with our Privacy Policy. By using our website, you consent to the collection, use, and disclosure of your personal information as described in our Privacy Policy.
                            </li>
                        </ul>
                    </li>
                    <li className="mb-[1rem]">
                        <p className="text-lg">Limitation of Liability:</p>
                        <ul className="list-disc ml-[3%]">
                            <li className="mb-[1rem]">
                            To the fullest extent permitted by law, we disclaim all warranties and liability related to your use of our website and services. We shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your access or use of our website.
                            </li>
                        </ul>
                    </li>
                    <li className="mb-[1rem]">
                        <p className="text-lg">Governing Law and Jurisdiction:</p>
                        <ul className="list-disc ml-[3%]">
                            <li className="mb-[1rem]">
                                These Terms shall be governed by and construed in accordance with the laws of INDIA. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in INDIA.
                            </li>
                        </ul>
                    </li>
                    <li className="mb-[1rem]">
                        <p className="text-lg">Relationship between Startups, Customers, and Investors:</p>
                        <ul className="list-disc ml-[3%]">
                            <li className="mb-[1rem]">
                                Startups, Customers, and Investors acknowledge that our platform acts as an intermediary and does not have control over the actions, conduct, or performance of any party involved. We do not guarantee the actions or obligations of Startups, Customers, or Investors, and each party is responsible for their own actions and compliance with applicable laws.
                            </li>
                        </ul>
                    </li>
                    <li className="mb-[1rem]">
                        <p className="text-lg">Investment Risks:</p>
                        <ul className="list-disc ml-[3%]">
                            <li className="mb-[1rem]">
                                Investors acknowledge that investments in startup projects carry financial risks, including the risk of partial or complete loss of investment. It is the responsibility of the Investor to conduct due diligence and evaluate the risks associated with each project before making an investment.
                            </li>
                        </ul>
                    </li>
                    <li className="mb-[1rem]">
                        <p className="text-lg">Communications and Notifications:</p>
                        <ul className="list-disc ml-[3%]">
                            <li className="mb-[1rem]">
                                By using our website, you consent to receive communications from us, including updates, notifications, and promotional materials. You may opt-out of receiving marketing communications at any time.
                            </li>
                        </ul>
                    </li>
                    <li className="mb-[1rem]">
                        <p className="text-lg">Modifications and Updates:</p>
                        <ul className="list-disc ml-[3%]">
                            <li className="mb-[1rem]">
                                We reserve the right to modify or update these Terms at any time, and such changes will be effective upon posting on our website. It is your responsibility to review these Terms periodically for any updates.
                            </li>
                        </ul>
                    </li>
                    <li className="mb-[1rem]">
                        <p className="text-lg">Termination:</p>
                        <ul className="list-disc ml-[3%]">
                            <li className="mb-[1rem]">
                                We reserve the right to suspend or terminate your account, restrict access to our website, or remove any content without prior notice or liability, for reasons including but not limited to violations of these Terms or applicable laws.
                            </li>
                        </ul>
                    </li>
                    <li className="mb-[1rem]">
                        <p className="text-lg">Payment Gateway:</p>
                        <ul className="list-disc ml-[3%]">
                            <li className="mb-[1rem]">
                                Privacy Policy - <a target="_blank" href={"https://merchant.razorpay.com/policy/M0AUB2n9QbJjyX/privacy"} rel="noopener noreferrer" style={{color: "#0000ee", textDecoration: "underline"}} >  https://merchant.razorpay.com/policy/M0AUB2n9QbJjyX/privacy </a>
                            </li>
                            <li className="mb-[1rem]">
                                Terms and Conditions - <a target="_blank" href={"https://merchant.razorpay.com/policy/M0AUB2n9QbJjyX/terms"} rel="noopener noreferrer" style={{color: "#0000ee", textDecoration: "underline"}} >  https://merchant.razorpay.com/policy/M0AUB2n9QbJjyX/terms </a>
                            </li>
                        </ul>
                    </li>
                </ol>
        </>
    );
}

export default termsandconditions;
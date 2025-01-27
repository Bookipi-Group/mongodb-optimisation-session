import {
  CompanyModel,
  CustomerModel,
  InvoiceModel,
  PaymentModel,
  TCompany,
  TCustomer,
  TInvoice,
  TPayment,
} from "./models/index";
import { init } from "./modules/mongoose";
import { faker } from "@faker-js/faker";
import { Types } from "mongoose";

async function setupCompany() {
  const company = new CompanyModel({
    name: faker.company.name(),
  });
  await company.save();

  const customers: TCustomer[] = [];
  for (let i = 0; i < 1000; ++i) {
    customers.push({
      _id: new Types.ObjectId(),
      name: faker.person.fullName(),
    });
  }
  await CustomerModel.insertMany(customers);

  const invoices: TInvoice[] = [];
  const payments: TPayment[] = [];

  for (let i = 0; i < 10000; ++i) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const invoice: TInvoice = {
      _id: new Types.ObjectId(),
      companyId: company._id,
      customer: {
        _id: customer._id,
        name: customer.name,
      },
      payments: [],
    };
    if (Math.random() < 0.001) {
      for (let j = 0; j < Math.ceil(Math.random() * 3); ++j) {
        const payment: TPayment = {
          _id: new Types.ObjectId(),
          invoiceId: invoice._id,
          amount: Number.parseInt(
            faker.finance.amount({
              dec: 0,
              min: 1,
              max: 1000,
            }),
          ),
          date: faker.date.past(),
          cardType: Math.random() < 0.1 ? "credit" : "debit",
        };
        invoice.payments.push(payment);
        payments.push(payment);
      }
    }
    invoices.push(invoice);
  }

  await InvoiceModel.insertMany(invoices);
  await PaymentModel.insertMany(payments);
}

async function run() {
  await CompanyModel.deleteMany({});
  for (let i = 0; i < 50; ++i) {
    await setupCompany();
  }
}

init("invoices")
  .then(async () => {
    await run();
    console.log("end");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

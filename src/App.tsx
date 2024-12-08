import { useState, useEffect } from "react";
import Table from "./Components/Table";

interface ExpenseInformation {
  id: number;
  date: string;
  amount: string;
  merchant: string;
  category: string;
}

function App() {
  //|useState and useEffect|///////////////////////////////////////////

  const [expenseData, setExpenseData] = useState<ExpenseInformation[] | null>(
    null
  );

  const [userPrompt, setUserPrompt] = useState<string>("Data Loading...");

  useEffect(() => {
    // fetch the data and process it

    const fetchExpenseData = async (): Promise<void> => {
      try {
        // get data from the api (1 page only)
        const response = await fetch(
          "https://tip-transactions.vercel.app/api/transactions?page=1"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();

        if (data.transactions && data.transactions.length > 0) {
          // Process the data and format it to the required format if available
          const resultArray: ExpenseInformation[] = data.transactions.map(
            (transaction: T) => ({
              id: transaction.id,
              date: formatDate(transaction.date), // Convert to string format
              amount: `£${transaction.amount.toFixed(2)}`, // Convert to string format with 2 sig fig
              merchant: transaction.merchant,
              category:
                transaction.category.charAt(0).toUpperCase() +
                transaction.category.slice(1),
            })
          );

          // console.log(resultArray)

          setExpenseData(resultArray);
        } else {
          // no data retrieved from api
          setUserPrompt("No data found");
        }
      } catch (error) {
        // Handle errors hereee
        console.error("Error fetching data:", error);
        setUserPrompt("Error fetching data. Please try again later.");
      }
    };

    fetchExpenseData();
  }, []);

  //|Constant values|///////////////////////////////////////////

  const expenseHeader: string[] = [
    "ID",
    "Date",
    "Amount",
    "Merchant",
    "Category",
  ];

  // const expenseDataDummy: ExpenseInformation[] | null = [
  //   {
  //     id: 1,
  //     date: "08:03 - 16/10/2024",
  //     amount: "£80.43",
  //     merchant: "Sports Direct",
  //     category: "lifestyle",
  //   },
  //   {
  //     id: 2,
  //     date: "08:03 - 16/10/2024",
  //     amount: "£80.43",
  //     merchant: "Sports Direct",
  //     category: "lifestyle",
  //   },
  // ];

  //|Functions|///////////////////////////////////////////

  function formatDate(date: string): string {
    const dateObj = new Date(date);
    const hr = dateObj.getUTCHours().toString().padStart(2, "0");
    const min = dateObj.getUTCMinutes().toString().padStart(2, "0");

    const dd = dateObj.getDate().toString().padStart(2, "0");
    const mm = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const yyyy = dateObj.getFullYear();
    return `${hr}:${min} - ${dd}/${mm}/${yyyy}`;
  }

  //|Rendering|///////////////////////////////////////////

  // only render table if data is available and the length is more than 0

  return (
    <div id="template-text">
      <h2 className="centered-header">Expenses</h2>
      {expenseData?.length > 0 ? (
        <Table headers={expenseHeader} data={expenseData} />
      ) : (
        <p>{userPrompt}</p>
      )}
    </div>
  );
}

export default App;

// {"id":1,
// "date":"2024-10-16T08:03:00.214Z",
// "amount":80.43,
// "merchant":"Sports Direct",
// "category":"lifestyle"
// }

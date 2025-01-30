import axios from "axios";

export async function FilterPaginationData({
  create_new_arr = false,
  state,
  data,
  page,
  countRoute,
  data_to_send,
}) {
  let obj;
  if (state && !create_new_arr) {
    obj = { ...state, results: [...state.results, ...data], page: page };
  } else {
    await axios
      .post(`https://blogfly-app-2.onrender.com/${countRoute}`, data_to_send)
      .then(({ data: { totalDocs } }) => {
        console.log("count", totalDocs);
        obj = { results: data, page: 1, totalDocs };
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return obj;
}

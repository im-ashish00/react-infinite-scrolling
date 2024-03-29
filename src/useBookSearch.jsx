import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useBookSearch(query, pageNumber) {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(true);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setBooks([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: 'GET',
      url: 'https://openlibrary.org/search.json',
      params: { q: query, page: pageNumber },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setLoading(false);
        setBooks((prevBooks) => {
          return [
            ...new Set([
              ...prevBooks,
              ...res.data.docs.map((book) => book.title),
            ]),
          ];
        });
        setHasMore(res.data.docs.length > 0);
      })
      .catch((e) => {
        if(axios.isCancel(e)) return
        setError(true) 
      });

    return () => {
      cancel();
    };
  }, [query, pageNumber]);

  return { books, loading, error, hasMore };
}

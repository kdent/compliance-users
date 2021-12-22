import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useStore from './use-store'

const useId = (data, id) => {
  if (
    data.opr_to_arbs[id] ||
    data.user_id_to_name[id] ||
    data.facility_id_to_info[id]
  ) {
    return id
  } else {
    return null
  }
}

export default useId

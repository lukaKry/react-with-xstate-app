import LibraryHeader from './LibraryHeader'
import LibraryTable from './LibraryTable'
import LibraryUserInfo from './LibraryUserInfo'

export default function LibraryDesktop() {
  return (
    <div className='d-flex flex-column border border-dark'>
      <LibraryHeader />
      <LibraryTable />
      <LibraryUserInfo />
    </div>
  )
}

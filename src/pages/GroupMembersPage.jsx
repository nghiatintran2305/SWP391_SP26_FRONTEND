import { useState } from 'react'
import toast from 'react-hot-toast'
import PageHeader from '../components/PageHeader'
import { addGroupMemberApi, removeGroupMemberApi } from '../services/api'

export default function GroupMembersPage() {
  const [addForm, setAddForm] = useState({ groupId: '', accountId: '', role: 'MEMBER' })
  const [removeForm, setRemoveForm] = useState({ groupId: '', accountId: '' })

  const addMember = async (e) => {
    e.preventDefault()
    try {
      await addGroupMemberApi(addForm.groupId, { accountId: addForm.accountId, role: addForm.role })
      toast.success('Add member thành công')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Add member fail')
    }
  }

  const removeMember = async (e) => {
    e.preventDefault()
    try {
      await removeGroupMemberApi(removeForm.groupId, removeForm.accountId)
      toast.success('Remove member thành công')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Remove member fail')
    }
  }

  return (
    <div>
      <PageHeader title="Group members" description="BE hiện tại chưa có list/detail group public nên màn này cho admin thao tác trực tiếp bằng ID." />
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="soft-card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Add member</h2>
          <form className="mt-4 space-y-4" onSubmit={addMember}>
            <input className="soft-input" placeholder="Group ID" value={addForm.groupId} onChange={(e) => setAddForm((prev) => ({ ...prev, groupId: e.target.value }))} required />
            <input className="soft-input" placeholder="Account ID" value={addForm.accountId} onChange={(e) => setAddForm((prev) => ({ ...prev, accountId: e.target.value }))} required />
            <select className="soft-input" value={addForm.role} onChange={(e) => setAddForm((prev) => ({ ...prev, role: e.target.value }))}>
              <option value="LEADER">LEADER</option>
              <option value="MEMBER">MEMBER</option>
              <option value="LECTURER">LECTURER</option>
            </select>
            <button className="soft-button-primary w-full">Add member</button>
          </form>
        </div>

        <div className="soft-card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Remove member</h2>
          <form className="mt-4 space-y-4" onSubmit={removeMember}>
            <input className="soft-input" placeholder="Group ID" value={removeForm.groupId} onChange={(e) => setRemoveForm((prev) => ({ ...prev, groupId: e.target.value }))} required />
            <input className="soft-input" placeholder="Account ID" value={removeForm.accountId} onChange={(e) => setRemoveForm((prev) => ({ ...prev, accountId: e.target.value }))} required />
            <button className="soft-button w-full border border-red-200 bg-red-50 text-red-700 hover:bg-red-100">Remove member</button>
          </form>
        </div>
      </div>
    </div>
  )
}
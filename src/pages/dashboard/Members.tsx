import { useState } from "react";
import { Search, Mail, MoreVertical, Shield, User as UserIcon, Loader2 } from "lucide-react";
import { useMembers, useInviteMember } from "@/hooks/api/useMembers";
import { useProjects } from "@/hooks/api/useProjects";
import { EmptyMembers } from "@/components/empty-states";
import { toast } from "sonner";
import { AxiosError } from "axios";

const Members = () => {
  const [search, setSearch] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const { data: members, isLoading } = useMembers();
  const { data: projects } = useProjects();
  const inviteMember = useInviteMember();
  
  const [inviteData, setInviteData] = useState({
    email: "",
    role: "member" as "manager" | "member",
    projectId: "",
  });

  const filtered = members?.filter(m => m.user.name.toLowerCase().includes(search.toLowerCase())) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Members</h1>
          <p className="text-muted-foreground font-medium">Manage your team members</p>
        </div>
        <button onClick={() => setShowInvite(true)} className="clay-button bg-primary text-primary-foreground px-5 py-2.5 flex items-center gap-2 text-sm">
          <Mail className="w-4 h-4" /> Invite Member
        </button>
      </div>

      <div className="clay-card-inset p-1 flex items-center gap-2 max-w-md">
        <Search className="w-4 h-4 text-muted-foreground ml-3" />
        <input type="text" placeholder="Search members..." className="bg-transparent outline-none text-sm font-medium w-full py-2"
          value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyMembers onInvite={() => setShowInvite(true)} />
      ) : (
        <div className="grid gap-4">
          {filtered.map((member) => (
            <div key={member.id} className="clay-card p-5 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="clay-card-inset w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold gradient-text">
                  {member.user.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{member.user.name}</h3>
                    {member.role === "manager" && (
                      <span className="clay-badge bg-primary/10 text-primary px-2 py-0.5 text-xs flex items-center gap-1">
                        <Shield className="w-3 h-3" /> Manager
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">{member.user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center hidden sm:block">
                  <div className="text-lg font-bold">{member.tasks || 0}</div>
                  <div className="text-xs text-muted-foreground font-medium">Tasks</div>
                </div>
                <button className="clay-card-inset w-8 h-8 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowInvite(false)}>
          <div className="clay-card p-8 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-black mb-6">Invite Team Member</h2>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!inviteData.projectId) {
                  toast.error("Please select a project");
                  return;
                }
                inviteMember.mutate(inviteData, {
                  onSuccess: () => {
                    toast.success("Invitation sent successfully");
                    setShowInvite(false);
                    setInviteData({ email: "", role: "member", projectId: "" });
                  },
                  onError: (error: AxiosError<{ error?: string }>) => {
                    toast.error(error.response?.data?.error || "Failed to send invitation");
                  },
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-sm font-bold mb-1.5 block">Project</label>
                <select 
                  className="clay-input w-full px-4 py-3 text-sm font-medium outline-none"
                  value={inviteData.projectId}
                  onChange={(e) => setInviteData({ ...inviteData, projectId: e.target.value })}
                  required
                >
                  <option value="">Select a project</option>
                  {projects?.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-bold mb-1.5 block">Email Address</label>
                <input 
                  type="email" 
                  className="clay-input w-full px-4 py-3 text-sm font-medium outline-none" 
                  placeholder="colleague@example.com" 
                  value={inviteData.email}
                  onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-bold mb-1.5 block">Role</label>
                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setInviteData({ ...inviteData, role: "manager" })}
                    className={`clay-button px-4 py-2 text-sm flex items-center gap-1 ${inviteData.role === "manager" ? "bg-primary/10 text-primary" : "bg-muted text-foreground"}`}
                  >
                    <Shield className="w-3.5 h-3.5" /> Manager
                  </button>
                  <button 
                    type="button"
                    onClick={() => setInviteData({ ...inviteData, role: "member" })}
                    className={`clay-button px-4 py-2 text-sm flex items-center gap-1 ${inviteData.role === "member" ? "bg-primary/10 text-primary" : "bg-muted text-foreground"}`}
                  >
                    <UserIcon className="w-3.5 h-3.5" /> Member
                  </button>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowInvite(false)} 
                  className="clay-button bg-muted text-foreground flex-1 py-3 font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={inviteMember.isPending}
                  className="clay-button bg-primary text-primary-foreground flex-1 py-3 font-bold disabled:opacity-50"
                >
                  {inviteMember.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    "Send Invite"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;

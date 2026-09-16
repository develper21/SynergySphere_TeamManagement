import { useState, useRef, useEffect } from "react";
import { Send, Smile, Paperclip, MoreVertical, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDiscussions, useSendMessage } from "@/hooks/api/useDiscussions";
import { useProjects } from "@/hooks/api/useProjects";
import { getStoredUser } from "@/hooks/api/useAuth";
import { EmptyDiscussions } from "@/components/empty-states";
import { format } from "date-fns";
import { toast } from "sonner";
import { AxiosError } from "axios";

const Discussion = () => {
  const { data: projects } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const { data: messages, isLoading } = useDiscussions(selectedProjectId);
  const sendMessage = useSendMessage();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const currentUser = getStoredUser();

  useEffect(() => {
    if (projects && projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !selectedProjectId) return;
    sendMessage.mutate({
      projectId: selectedProjectId,
      content: input,
    }, {
      onSuccess: () => setInput(""),
      onError: (error: AxiosError<{ error?: string }>) => {
        toast.error(error.response?.data?.error || "Failed to send message");
      },
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-black">Discussion</h1>
          <div className="flex items-center gap-2">
            <select 
              className="bg-transparent text-sm text-muted-foreground font-medium outline-none cursor-pointer"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              {projects?.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
        <button className="clay-card-inset w-10 h-10 flex items-center justify-center rounded-xl">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : !messages || messages.length === 0 ? (
          <EmptyDiscussions onStart={() => {}} />
        ) : (
          messages.map((msg) => {
            const isOwn = msg.user.id === currentUser?.id;
            return (
              <div key={msg.id} className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
                <div className="flex items-end gap-2 max-w-[75%]">
                  {!isOwn && (
                    <div className="clay-card w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                      {msg.user.name[0]}
                    </div>
                  )}
                  <div>
                    {!isOwn && <span className="text-xs font-bold text-primary mb-1 block">{msg.user.name}</span>}
                    <div className={cn(
                      "p-3 rounded-2xl text-sm font-medium",
                      isOwn ? "bg-primary text-primary-foreground rounded-br-sm" : "clay-card rounded-bl-sm"
                    )}>
                      {msg.content}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1 block">
                      {format(new Date(msg.createdAt), "h:mm a")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="clay-card p-2 flex items-center gap-2">
        <button className="clay-card-inset w-10 h-10 flex items-center justify-center rounded-xl shrink-0">
          <Paperclip className="w-4 h-4 text-muted-foreground" />
        </button>
        <input
          type="text"
          placeholder="Type a message..."
          className="bg-transparent outline-none text-sm font-medium w-full px-2 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="clay-card-inset w-10 h-10 flex items-center justify-center rounded-xl shrink-0">
          <Smile className="w-4 h-4 text-muted-foreground" />
        </button>
        <button 
          onClick={handleSend}
          disabled={sendMessage.isPending || !input.trim()}
          className="clay-button bg-primary text-primary-foreground w-10 h-10 flex items-center justify-center shrink-0 disabled:opacity-50"
        >
          {sendMessage.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Discussion;

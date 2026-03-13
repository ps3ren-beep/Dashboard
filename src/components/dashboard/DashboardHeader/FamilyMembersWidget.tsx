import { useFinance } from '@/contexts';
import { IconUser, IconPlus, IconCheck } from '@/components/icons/SidebarIcons';

interface FamilyMembersWidgetProps {
  onAddMember: () => void;
}

export function FamilyMembersWidget({ onAddMember }: FamilyMembersWidgetProps) {
  const { familyMembers, selectedMember, setSelectedMember } = useFinance();

  return (
    <div className="flex items-center" style={{ gap: 'var(--space-16)' }}>
      <div className="flex -space-x-3">
        {familyMembers.map((member) => {
          const isSelected = selectedMember === member.id;
          return (
            <button
              key={member.id}
              type="button"
              onClick={() => setSelectedMember(isSelected ? null : member.id)}
              className="relative z-0 flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-surface-50 bg-neutral-300 shadow-sm transition-transform hover:z-10 hover:scale-110 focus:outline-none min-[768px]:size-[50px]"
              style={{
                borderColor: isSelected ? 'var(--color-neutral-900)' : 'var(--color-surface-50)',
                borderWidth: isSelected ? 3 : 2,
              }}
              title={member.name}
            >
              {member.avatarUrl ? (
                <img
                  src={member.avatarUrl}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <IconUser className="size-6 text-secondary-normal" />
              )}
              {isSelected && (
                <span className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-lime">
                  <IconCheck className="size-2.5 text-neutral-900" />
                </span>
              )}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={onAddMember}
        className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-neutral-300 bg-surface-50 text-secondary-normal transition-colors hover:bg-neutral-300/50 min-[768px]:size-[50px]"
        aria-label="Adicionar membro"
      >
        <IconPlus className="size-6" />
      </button>
    </div>
  );
}

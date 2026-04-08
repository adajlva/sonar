import { Ability } from '@casl/ability'

export function defineAbilities() {
  return new Ability([
    { action: 'read', subject: 'feed' },
    { action: 'read', subject: 'consultCollaborators' },
    { action: 'manage', subject: 'consultCollaborators' },
    { action: 'read', subject: 'consultHierarchies' },
    { action: 'read', subject: 'files_inWorkplaceModule' },
    { action: 'read', subject: 'grid_inWorkplaceModule' },
    { action: 'read', subject: 'registerFiles_inWorkplaceModule' },
    { action: 'read', subject: 'requests_inWorkplaceModule' },
    { action: 'manage', subject: 'admission' },
    { action: 'read', subject: 'records' },
    { action: 'manage', subject: 'records' },
    { action: 'read', subject: 'followup' },
    { action: 'manage', subject: 'followup' },
    { action: 'read', subject: 'training' },
    { action: 'manage', subject: 'training' },
    { action: 'read', subject: 'execution' },
    { action: 'manage', subject: 'execution' }
  ])
}

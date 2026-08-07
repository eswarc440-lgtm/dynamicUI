import React, { useState } from 'react';
import { DynamicUISchema } from '../types';
import {
  FolderKanban,
  Search,
  Sparkles,
  LayoutGrid,
  BarChart3,
  Calculator,
  Table as TableIcon,
  ArrowRight,
  Clock,
  Trash2,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { motion } from 'motion/react';

interface ProjectsViewProps {
  projects: DynamicUISchema[];
  currentSchemaId?: string;
  onSelectProject: (schema: DynamicUISchema) => void;
  onDeleteProject?: (id: string) => void;
  onNewProjectClick: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  currentSchemaId,
  onSelectProject,
  onDeleteProject,
  onNewProjectClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category || 'General')))];

  const filteredProjects = projects.filter(project => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.generatedPrompt && project.generatedPrompt.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getComponentCount = (schema: DynamicUISchema) => {
    let charts = 0;
    let calculators = 0;
    let tables = 0;
    let total = 0;

    schema.layout.forEach(section => {
      section.components.forEach(comp => {
        total++;
        if (comp.type === 'chart') charts++;
        if (comp.type === 'calculator') calculators++;
        if (comp.type === 'table') tables++;
      });
    });

    return { charts, calculators, tables, total };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium mb-1">
            <FolderKanban className="w-4 h-4 text-emerald-600" />
            <span>Workspace History & Saved Interfaces</span>
          </div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            UI Projects ({projects.length})
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Select any generated UI to restore and edit it in the workspace.
          </p>
        </div>

        <button
          onClick={onNewProjectClick}
          className="self-start sm:self-auto inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Generate New UI</span>
        </button>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 text-zinc-400 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search saved projects by title or prompt..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-zinc-200 focus:border-zinc-400 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none shadow-2xs transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-zinc-900 text-white shadow-2xs'
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
            <FolderKanban className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-800">No UI Projects Found</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Try adjusting your search query or generate a new custom UI interface.
          </p>
          <button
            onClick={onNewProjectClick}
            className="inline-flex items-center gap-2 bg-zinc-900 text-white text-xs px-4 py-2 rounded-xl font-medium mt-2"
          >
            Create New UI
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map(project => {
            const isSelected = currentSchemaId === project.id;
            const stats = getComponentCount(project);

            return (
              <motion.div
                key={project.id}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
                className={`group bg-white border rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'border-zinc-200/80 hover:border-zinc-300'
                }`}
                onClick={() => onSelectProject(project)}
              >
                {/* Active Indicator Badge */}
                {isSelected && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-semibold px-3 py-1 rounded-bl-xl flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Currently Active</span>
                  </div>
                )}

                <div className="space-y-3">
                  {/* Category Pill & Metrics Count */}
                  <div className="flex items-center justify-between pr-12">
                    <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 text-[10px] font-medium uppercase tracking-wider">
                      {project.category || 'Interface'}
                    </span>
                    <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Saved
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h2 className="text-sm font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                      {project.title}
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Prompt Quote if present */}
                  {project.generatedPrompt && (
                    <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-2.5 text-[11px] text-zinc-600 italic line-clamp-2">
                      "{project.generatedPrompt}"
                    </div>
                  )}
                </div>

                {/* Footer Component Breakdown & Open CTA */}
                <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-medium">
                    {project.metrics && project.metrics.length > 0 && (
                      <span className="flex items-center gap-1" title={`${project.metrics.length} Metrics Cards`}>
                        <Layers className="w-3.5 h-3.5 text-zinc-500" />
                        {project.metrics.length} KPIs
                      </span>
                    )}
                    {stats.charts > 0 && (
                      <span className="flex items-center gap-1" title={`${stats.charts} Charts`}>
                        <BarChart3 className="w-3.5 h-3.5 text-zinc-500" />
                        {stats.charts}
                      </span>
                    )}
                    {stats.calculators > 0 && (
                      <span className="flex items-center gap-1" title={`${stats.calculators} Calculators`}>
                        <Calculator className="w-3.5 h-3.5 text-zinc-500" />
                        {stats.calculators}
                      </span>
                    )}
                    {stats.tables > 0 && (
                      <span className="flex items-center gap-1" title={`${stats.tables} Tables`}>
                        <TableIcon className="w-3.5 h-3.5 text-zinc-500" />
                        {stats.tables}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {onDeleteProject && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onDeleteProject(project.id);
                        }}
                        className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 group-hover:text-emerald-600 transition-colors">
                      <span>Open UI</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

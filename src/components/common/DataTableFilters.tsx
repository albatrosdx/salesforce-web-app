'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'

export interface FilterConfig {
  field: string
  label: string
  type: 'text' | 'select' | 'date'
  options?: { value: string; label: string }[]
}

export interface FilterValue {
  field: string
  value: string
  operator?: 'equals' | 'contains' | 'starts' | 'ends'
}

interface DataTableFiltersProps {
  filters: FilterConfig[]
  activeFilters: FilterValue[]
  onFiltersChange: (filters: FilterValue[]) => void
}

export function DataTableFilters({
  filters,
  activeFilters,
  onFiltersChange,
}: DataTableFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempFilters, setTempFilters] = useState<FilterValue[]>(activeFilters)

  const handleAddFilter = (field: string) => {
    const filterConfig = filters.find(f => f.field === field)
    if (!filterConfig) return

    const newFilter: FilterValue = {
      field,
      value: '',
      operator: filterConfig.type === 'text' ? 'contains' : 'equals',
    }

    setTempFilters([...tempFilters, newFilter])
  }

  const handleRemoveFilter = (index: number) => {
    setTempFilters(tempFilters.filter((_, i) => i !== index))
  }

  const handleFilterChange = (index: number, updates: Partial<FilterValue>) => {
    const updated = [...tempFilters]
    updated[index] = { ...updated[index], ...updates }
    setTempFilters(updated)
  }

  const handleApplyFilters = () => {
    onFiltersChange(tempFilters.filter(f => f.value))
    setIsOpen(false)
  }

  const handleClearFilters = () => {
    setTempFilters([])
    onFiltersChange([])
  }

  const availableFilters = filters.filter(
    f => !tempFilters.some(tf => tf.field === f.field)
  )

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative">
          <FunnelIcon className="h-4 w-4 mr-2" />
          フィルター
          {activeFilters.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {activeFilters.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">フィルター設定</h3>
            {tempFilters.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-red-600 hover:text-red-700"
              >
                すべてクリア
              </Button>
            )}
          </div>

          {tempFilters.map((filter, index) => {
            const config = filters.find(f => f.field === filter.field)
            if (!config) return null

            return (
              <div key={index} className="space-y-2 p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <Label>{config.label}</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFilter(index)}
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </Button>
                </div>

                {config.type === 'text' && (
                  <div className="space-y-2">
                    <Select
                      value={filter.operator}
                      onValueChange={(value) =>
                        handleFilterChange(index, { operator: value as FilterValue['operator'] })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contains">含む</SelectItem>
                        <SelectItem value="equals">完全一致</SelectItem>
                        <SelectItem value="starts">で始まる</SelectItem>
                        <SelectItem value="ends">で終わる</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={filter.value}
                      onChange={(e) =>
                        handleFilterChange(index, { value: e.target.value })
                      }
                      placeholder={`${config.label}を入力`}
                    />
                  </div>
                )}

                {config.type === 'select' && (
                  <Select
                    value={filter.value}
                    onValueChange={(value) =>
                      handleFilterChange(index, { value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      {config.options?.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {config.type === 'date' && (
                  <Input
                    type="date"
                    value={filter.value}
                    onChange={(e) =>
                      handleFilterChange(index, { value: e.target.value })
                    }
                  />
                )}
              </div>
            )
          })}

          {availableFilters.length > 0 && (
            <div className="space-y-2">
              <Label>フィルターを追加</Label>
              <Select onValueChange={handleAddFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="項目を選択" />
                </SelectTrigger>
                <SelectContent>
                  {availableFilters.map(filter => (
                    <SelectItem key={filter.field} value={filter.field}>
                      {filter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleApplyFilters}>
              適用
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}